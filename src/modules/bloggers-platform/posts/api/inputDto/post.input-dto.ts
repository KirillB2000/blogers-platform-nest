import { IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"
import { postRestrictions } from "../../domain/posts.entity.js"

export class PostInputModel {

    @IsString()
    @MaxLength(postRestrictions.titleMaxLength)
    @IsNotEmpty()
    @Trim()
    title: string

    @IsString()
    @MaxLength(postRestrictions.shortDescriptionMaxLength)
    @IsNotEmpty()
    @Trim()
    shortDescription: string

    @IsString()
    @MaxLength(postRestrictions.contentMaxLength)
    @IsNotEmpty()
    @Trim()
    content: string

    @IsMongoId()
    @IsNotEmpty()
    @Trim()
    blogId: string
}