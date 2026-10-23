import { IsEnum } from "class-validator";
import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { CommentsSortBy } from "./comments-sort-by.js";

export class GetCommentQueryParams extends BaseQueryParams {
    @IsEnum(CommentsSortBy)
    sortBy: string =  CommentsSortBy.CreatedAt
}