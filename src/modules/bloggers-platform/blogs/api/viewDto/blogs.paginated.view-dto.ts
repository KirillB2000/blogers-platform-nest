import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { BlogViewModel } from "./blogs.view-dto.js";

export class BlogsPaginatedViewDto extends PaginatedViewDto<BlogViewModel[]> {
    items: BlogViewModel[];
}