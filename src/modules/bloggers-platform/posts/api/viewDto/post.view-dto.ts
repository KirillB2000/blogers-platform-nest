import { LikeStatus } from "../../../../../core/types/like-statuses.js"
import { PostDbRowWithBlogName } from "../../domain/post-sql-model.js"
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
        postSqlRowBN: PostDbRowWithBlogName,
        //myStatus: LikeStatus,
        //newestLikes: LikeDetailsViewModel[] | []
    ) {
        const postViewM = new PostViewModel()

        postViewM.id = postSqlRowBN.id.toString()
        postViewM.title = postSqlRowBN.title
        postViewM.shortDescription = postSqlRowBN.short_description
        postViewM.content = postSqlRowBN.content
        postViewM.blogId = postSqlRowBN.blog_id.toString()
        postViewM.blogName = postSqlRowBN.blog_name
        postViewM.createdAt = postSqlRowBN.created_at
        postViewM.extendedLikesInfo = {
            dislikesCount: 0,
            likesCount: 0,
            myStatus: LikeStatus.None,
            newestLikes: []
        }

        return postViewM
    }
}