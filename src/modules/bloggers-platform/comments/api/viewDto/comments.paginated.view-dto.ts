import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { CommentViewModel } from "./comments.view-dto.js";

export class CommentsPaginatedViewDto extends PaginatedViewDto<CommentViewModel[]> {
    items: CommentViewModel[];
}