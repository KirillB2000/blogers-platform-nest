import { InjectModel } from "@nestjs/mongoose";
import { Post, PostDocument, type PostModelType } from "../domain/posts.entity.js";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class PostsRepository {
    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType
    ) {}

    async save (postDoc: PostDocument) {
        await postDoc.save()
    }

    async findByIdOrFail (
        id: string
    ): Promise<PostDocument> {
        const postDoc = await this.PostModel.findById(id)

        if(!postDoc) {
            throw new NotFoundException('Post not found')
        }

        return postDoc
    }

    async deleteByIdOrFail (
        id: string
    ): Promise<void> {
        const result = await this.PostModel.deleteOne({_id: id})

        if (result.deletedCount === 0) {
            throw new NotFoundException('Post not found')
        }
    }
}