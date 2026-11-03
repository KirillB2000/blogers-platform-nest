import { IsNotEmpty, IsString, MaxLength } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"
import { postRestrictions } from "../../../posts/domain/posts.entity.js"

export class BlogPostInputModel {
    @IsString()
    @IsNotEmpty()
    @MaxLength(postRestrictions.titleMaxLength)
    @Trim()
    title: string

    @IsString()
    
    @MaxLength(postRestrictions.shortDescriptionMaxLength)
    @Trim()
    shortDescription: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(postRestrictions.contentMaxLength)
    @Trim()
    content: string
}