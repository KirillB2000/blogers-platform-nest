import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"
import { blogsRestrictions } from "../../domain/blogs.entity.js"

export class BlogInputModel {

    @IsString()
    @IsNotEmpty()
    @MaxLength(blogsRestrictions.nameMaxLength)
    @Trim() 
    name: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(blogsRestrictions.descriptionMaxLength)
    @Trim() 
    description: string

    @IsString()
    @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
    @IsNotEmpty()
    @MaxLength(blogsRestrictions.websiteUrlMaxLength)
    @Trim() 
    websiteUrl: string
}