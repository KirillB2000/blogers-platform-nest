import { InjectModel } from "@nestjs/mongoose";
import { LikeStatusPosts, LikeStatusPostsDocument, type LikeStatusPostsModelType } from "../domain/posts-like-status.entity.js";
import { LikeStatus } from "../../../../core/types/like-statuses.js";


export class LikeStatusPostsRepository {
    constructor (
        @InjectModel(LikeStatusPosts.name)
        private LikeStatusPostsModel: LikeStatusPostsModelType
    ) {}

    async save(likeStatusPostDoc: LikeStatusPostsDocument) {
        await likeStatusPostDoc.save()
    }

    async findLikeStatusForSpecificPost(
        userId: string, 
        postId: string
    ): Promise<LikeStatusPostsDocument | null> {
        const likeStatusInfo = this.LikeStatusPostsModel.findOne(
            {userId, postId}
        ).exec()

        return likeStatusInfo
    }

    async deleteLikeStatusForSpecificPost (
        userId: string,
        postId: string
    ): Promise <void> {
        await this.LikeStatusPostsModel.deleteOne(
            {userId, postId}
        ).exec()
    }

    async findNewestLikes(
        postId: string
    ): Promise<LikeStatusPostsDocument[]> {
        return this.LikeStatusPostsModel
            .find({ postId, myStatus: LikeStatus.Like })
            .sort({ addedAt: -1 })
            .limit(3)
            .exec()
    }
}