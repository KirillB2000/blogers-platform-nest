import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model } from "mongoose"
import { CreateBlogDomainDto } from "./dto/create-blog.domain.js"
import { BlogInputModel } from "../api/inputDto/blogs.input-dto.js"

export const blogsRestrictions = {
    nameMaxLength: 15,
    descriptionMaxLength: 500,
    websiteUrlMaxLength: 100
}

@Schema({timestamps: true})
export class Blog {
    @Prop({
        required: true,
        type: String,
        maxLength: blogsRestrictions.nameMaxLength
    })
    name: string

    @Prop({
        required: true,
        type: String,
        maxLength: blogsRestrictions.descriptionMaxLength
    })
    description: string

    @Prop({
        required: true,
        type: String,
        maxLength: blogsRestrictions.websiteUrlMaxLength,
    })
    websiteUrl: string

    @Prop({
        required: true,
        type: Boolean
    })
    isMembership: boolean

    createdAt: Date
    updatedAt: Date

    static createInstance(dto: CreateBlogDomainDto) {
        const blog = new this()

        blog.name = dto.name
        blog.description = dto.description
        blog.websiteUrl = dto.websiteUrl

        blog.isMembership = dto.isMembership ?? false

        return blog as BlogDocument
    }

    update (dto: BlogInputModel) {
        this.name = dto.name
        this.description = dto.description
        this.websiteUrl = dto.websiteUrl
    }
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

BlogSchema.loadClass(Blog)

export type BlogDocument = HydratedDocument<Blog>

export type BlogModelType = Model<BlogDocument> & typeof Blog