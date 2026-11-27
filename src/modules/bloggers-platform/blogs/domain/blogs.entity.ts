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
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

BlogSchema.loadClass(Blog)

export type BlogDocument = HydratedDocument<Blog>

export type BlogModelType = Model<BlogDocument> & typeof Blog