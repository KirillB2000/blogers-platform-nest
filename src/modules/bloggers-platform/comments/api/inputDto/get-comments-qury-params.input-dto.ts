import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { CommentsSortBy } from "./comments-sort-by.js";

export class GetCommentQueryParams extends BaseQueryParams {
    sortBy: string =  CommentsSortBy.CreatedAt
}