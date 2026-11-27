export abstract class PaginatedViewDto<T> {
    abstract items: T
    totalCount: number
    pagesCount: number
    page: number
    pageSize: number

    public static mapToView<T>(data: {
        items: T
        page: number
        size: number
        totalCount: string
    }): PaginatedViewDto<T> {
        return {
            totalCount: Number(data.totalCount),
            pagesCount: Math.ceil(Number(data.totalCount) / data.size),
            page: data.page,
            pageSize: data.size,
            items: data.items,
        }
    }
}