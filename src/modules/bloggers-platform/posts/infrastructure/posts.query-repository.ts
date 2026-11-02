import { Injectable, NotFoundException } from "@nestjs/common";
import { GetPostsQueryParams } from "../api/inputDto/get-posts-query-params.input-dto.js";
import { InjectModel } from "@nestjs/mongoose";
import { Post, type PostModelType } from "../domain/posts.entity.js";
import { PostViewModel } from "../api/viewDto/post.view-dto.js";
import { PostPagindatedViewDto } from "../api/viewDto/posts.paginated.view-dto.js";
import { LikeStatus } from "../../../../core/types/like-statuses.js";
import { LikeStatusPostsRepository } from "./posts-like-status.repository.js";
import { LikeDetailsViewModel } from "../api/viewDto/likeDetails.view-dto.js";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto.js";
import { LikeStatusPosts, type LikeStatusPostsModelType } from "../domain/posts-like-status.entity.js";


@Injectable()
export class PostsQwRepo {
    
    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(LikeStatusPosts.name)
        private LikeStatustPostsModel: LikeStatusPostsModelType,
        private likeStatusPostsRepository: LikeStatusPostsRepository
    ) {}

    async getAll (
        query: GetPostsQueryParams,
        userId?: string | null,
        blogId?: string
    ): Promise<PaginatedViewDto<PostViewModel[]>> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection
        } = query

        const filter: any = {}
        const skip = query.calculateSkip()

        if (blogId) {
            filter.blogId = blogId
        }

        const result = await this.PostModel
            .find(filter)
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(pageSize)
            .exec()

        const totalCount = await this.PostModel.countDocuments(filter)

        const postIds = result.map(post => post.id)
        const postLikesMap: Record<string, LikeStatus> = {}

        if (userId) {
            const likeStatusDocs = await this.LikeStatustPostsModel
                .find({userId, postId: { $in: postIds}})
                .lean() as LikeStatusPosts[]

            likeStatusDocs.map(lSDoc => {
                postLikesMap[lSDoc.postId] = lSDoc.myStatus
            })
        }

        const itemsPromises = result.map(async post => {
            const myStatus = postLikesMap[post.id] || LikeStatus.None

            const likeInfoDocs = await this.likeStatusPostsRepository.findNewestLikes(post.id)

            const newestLikes = likeInfoDocs.map(likeInf => {
                return {
                    addedAt: likeInf.addedAt,
                    login: likeInf.login,
                    userId: likeInf.userId
                }
            })

            return PostViewModel.mapToView(post, myStatus, newestLikes)
        })

        const items = await Promise.all(itemsPromises)

        return PostPagindatedViewDto.mapToView({
            items: items,
            totalCount,
            page: pageNumber,
            size: pageSize
        })
    }

    async getByIdOrFail (
        postId: string,
        userId?: string | null
    ): Promise<PostViewModel> {
        const postDoc = await this.PostModel.findById(postId).lean().exec()

        if (!postDoc) {
            throw new NotFoundException('Post not found')
        }

        let myStatus = LikeStatus.None
        let newestLikes: LikeDetailsViewModel[] = []

        if (userId) {
            const postLikeStatus = await this.likeStatusPostsRepository
                .findLikeStatusForSpecificPost(userId, postId)

            if (postLikeStatus) {
                myStatus = postLikeStatus.myStatus
            }
        }

        const likeInfoDocs = await this.likeStatusPostsRepository.findNewestLikes(postId)

        newestLikes = likeInfoDocs.map(likeInf => {
            return {
                addedAt: likeInf.addedAt,
                login: likeInf.login,
                userId: likeInf.userId
            }
        })

        return PostViewModel.mapToView(postDoc, myStatus, newestLikes)
    }
} 