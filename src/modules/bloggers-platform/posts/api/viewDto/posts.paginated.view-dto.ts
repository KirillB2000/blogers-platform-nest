import { PaginatedViewDto } from "../../../../../core/dto/base.paginated.view-dto.js";
import { PostViewModel } from "./post.view-dto.js";


export class PostPagindatedViewDto extends PaginatedViewDto<PostViewModel[]> {
    items: PostViewModel[];
}