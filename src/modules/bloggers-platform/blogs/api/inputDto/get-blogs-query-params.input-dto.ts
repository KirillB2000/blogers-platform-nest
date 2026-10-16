import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { BlogsSortBy } from "./blogs-srot-by.js";

export class GetBlogsQueryParams extends BaseQueryParams {
    sortBy = BlogsSortBy.CreatedAt
    searchNameTerm: string | null = null
}