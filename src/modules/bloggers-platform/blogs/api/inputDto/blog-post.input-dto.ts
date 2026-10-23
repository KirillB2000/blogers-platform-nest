import { IsString } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"

export class BlogPostInputModel {
    @IsString()
    @Trim()
    title: string

    @IsString()
    @Trim()
    shortDescription: string

    @IsString()
    @Trim()
    content: string
}