import { IsString } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim-transform.decorator.js"

export class BlogInputModel {

    @IsString()
    @Trim()
    name: string

    @IsString()
    @Trim()
    description: string

    @IsString()
    @Trim()
    websiteUrl: string
}