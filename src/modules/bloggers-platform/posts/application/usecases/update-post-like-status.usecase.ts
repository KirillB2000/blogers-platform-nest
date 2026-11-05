import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeStatus } from "../../../../../core/types/like-statuses.js";
import { PostsRepository } from "../../infrastructure/posts.repository.js";
import { Inject, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../../../user-accounts/infrastructure/users.repository.js";
import { LikeStatusPostsRepository } from "../../infrastructure/posts-like-status.repository.js";
import { InjectModel } from "@nestjs/mongoose";
import { LikeStatusPosts, type LikeStatusPostsModelType } from "../../domain/posts-like-status.entity.js";

export class UpdatePostLikeStatusCommand {
    constructor (
        public userId: string,
        public postId: string,
        public newStatus: LikeStatus
    ) {

    }
}

@CommandHandler(UpdatePostLikeStatusCommand)
export class UpdatePostLikeStatusUseCase implements ICommandHandler<UpdatePostLikeStatusCommand, void> {
    constructor (
        @InjectModel(LikeStatusPosts.name)
        private LikeStatusPostsModel: LikeStatusPostsModelType,
        private postsRepository: PostsRepository,
        private usersRepository: UsersRepository,
        private likeStatusPostsRepository: LikeStatusPostsRepository
    ) {

    }

    async execute(
        command: UpdatePostLikeStatusCommand
    ): Promise<void> {
        const { userId, postId, newStatus } = command

        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new UnauthorizedException('Unauthorized')
        }

        const login = user.login

        const post = await this.postsRepository.findById(postId)

        if (!post) {
            throw new NotFoundException('Post not found')
        }

        let likeStatusPostDoc = await this.likeStatusPostsRepository.findLikeStatusForSpecificPost(userId, postId)

        const oldStatus = likeStatusPostDoc ? likeStatusPostDoc.myStatus : LikeStatus.None

        if (newStatus === oldStatus) return

        if (newStatus === LikeStatus.None) {
            await this.likeStatusPostsRepository.deleteLikeStatusForSpecificPost(userId, postId)
        } else {
            if (!likeStatusPostDoc) {
                likeStatusPostDoc = this.LikeStatusPostsModel.createInstance({login, myStatus: newStatus, postId, userId})
            }
            likeStatusPostDoc.myStatus = newStatus
            await this.likeStatusPostsRepository.save(likeStatusPostDoc)
        }

        post.updateLikeCounters(oldStatus, newStatus)
        await this.postsRepository.save(post)
    }
}