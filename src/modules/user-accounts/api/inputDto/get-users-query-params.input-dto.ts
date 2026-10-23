import { IsEnum, IsOptional, IsString } from "class-validator";
import { BaseQueryParams } from "../../../../core/dto/base.query-params.input-dto.js";
import { UsersSortBy } from "./users-sort-by.js";

export class GetUsersQueryParams extends BaseQueryParams {
    @IsEnum(UsersSortBy)
    sortBy = UsersSortBy.CreatedAt

    @IsString()
    @IsOptional()
    searchLoginTerm: string | null = null


    @IsString()
    @IsOptional()
    searchEmailTerm: string | null = null
}