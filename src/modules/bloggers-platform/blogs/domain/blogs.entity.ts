import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { HydratedDocument, Model } from "mongoose"
import { CreateBlogDomainDto } from "./dto/create-blog.domain.js"
import { BlogInputModel } from "../api/inputDto/blogers.input-dto.js"

@Schema({timestamps: true})
export class Blog {
    @Prop({
        required: true,
        type: String,
        maxLength: 15
    })
    name: string

    @Prop({
        required: true,
        type: String,
        maxLength: 500
    })
    description: string

    @Prop({
        required: true,
        type: String,
        maxLength: 100,
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