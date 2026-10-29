import { IsStringWithTrim } from "../../../../../core/decorators/trim-and-string-validate.decorators.js";
import { contentConstraints } from "../../domain/comments.entity.js";

export class CommentInputModel {

    @IsStringWithTrim(contentConstraints.minLength, contentConstraints.maxLength)
    content: string
}