import { PostDocument } from "../../domain/posts.entity.js"
import { ExtendedLikesInfoViewModel } from "./extendedLikes.view-dto.js"

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
        postDoc: PostDocument
    ) {
        const postViewM = new PostViewModel()

        postViewM.id = postDoc._id.toString()
        postViewM.title = postDoc.title
        postViewM.shortDescription = postDoc.shortDescription
        postViewM.content = postDoc.content
        postViewM.blogId = postDoc.blogId
        postViewM.blogName = postDoc.blogName
        postViewM.createdAt = postDoc.createdAt
        postViewM.extendedLikesInfo = postDoc.extendedLikesInfo

        return postViewM
    }
}