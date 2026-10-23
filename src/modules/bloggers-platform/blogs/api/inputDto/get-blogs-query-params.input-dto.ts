import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseQueryParams } from "../../../../../core/dto/base.query-params.input-dto.js";
import { BlogsSortBy } from "./blogs-sort-by.js";

export class GetBlogsQueryParams extends BaseQueryParams {

    @IsEnum(BlogsSortBy)
    sortBy = BlogsSortBy.CreatedAt
    
    @IsString()
    @IsOptional()
    searchNameTerm: string | null = null
}