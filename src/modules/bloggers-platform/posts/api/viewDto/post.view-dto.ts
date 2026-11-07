import { LikeStatus } from "../../../../../core/types/like-statuses.js"
import { PostDocument } from "../../domain/posts.entity.js"
import { ExtendedLikesInfoViewModel } from "./extendedLikes.view-dto.js"
import { LikeDetailsViewModel } from "./likeDetails.view-dto.js"

export class PostViewModel {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfoViewModel

    static mapToView (
        postDoc: PostDocument,
        myStatus: LikeStatus,
        newestLikes: LikeDetailsViewModel[] | []
    ) {
        const postViewM = new PostViewModel()

        postViewM.id = postDoc._id.toString()
        postViewM.title = postDoc.title
        postViewM.shortDescription = postDoc.shortDescription
        postViewM.content = postDoc.content
        postViewM.blogId = postDoc.blogId
        postViewM.blogName = postDoc.blogName
        postViewM.createdAt = postDoc.createdAt
        postViewM.extendedLikesInfo = {
            dislikesCount: postDoc.extendedLikesInfo.dislikesCount,
            likesCount: postDoc.extendedLikesInfo.likesCount,
            myStatus: myStatus,
            newestLikes: newestLikes
        }

        return postViewM
    }
}