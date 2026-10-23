import { IsEnum } from "class-validator";
import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { PostsSortBy } from "./posts-sort-by.js";


export class GetPostsQueryParams extends BaseQueryParams {

    @IsEnum(PostsSortBy)
    sortBy: string = PostsSortBy.CreatedAt
}