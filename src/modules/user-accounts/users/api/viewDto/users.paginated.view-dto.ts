import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { UserViewDto } from "./users.view-dto.js";

export class UsersPaginatedViewDto extends PaginatedViewDto<UserViewDto[]> {
    items: UserViewDto[];
}