import { IsString } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"

export class PostInputModel {

    @IsString()
    @Trim()
    title: string

    @IsString()
    @Trim()
    shortDescription: string

    @IsString()
    @Trim()
    content: string

    @IsString()
    @Trim()
    blogId: string
}