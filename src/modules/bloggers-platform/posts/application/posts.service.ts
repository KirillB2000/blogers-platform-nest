import { Injectable } from '@nestjs/common';
import { PostViewModel } from '../api/viewDto/post.view-dto.js';
import { PostInputModel } from '../api/inputDto/post.input-dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../domain/posts.entity.js';
import { PostsRepository } from '../infrastructure/posts.repository.js';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository.js';

@Injectable()
export class PostsService {

    constructor (
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository
    ) {}

    async createPost (
        dto: PostInputModel
    ): Promise<PostViewModel> {
        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId)
        const blogName = blog.name


        const postDoc = this.PostModel.createInstance({
            ...dto,
            blogName: blogName
        })

        await this.postsRepository.save(postDoc)

        return PostViewModel.mapToView(postDoc)
    }

    async updatePost (
        id: string,
        body: PostInputModel
    ): Promise<void> {
        const postDoc = await this.postsRepository.findByIdOrFail(id)

        const blog = await this.blogsRepository.findByIdOrFail(body.blogId)
        const blogName = blog.name

        postDoc.update({
            ...body,
            blogName
        })

        await this.postsRepository.save(postDoc)
    }

    async deletePost (
        id: string
    ): Promise<void> {
        await this.postsRepository.deleteByIdOrFail(id)
    }
}