export class PostDbRow {
    id: number;
    title: string;
    short_description: string;
    content: string;
    blog_id: number;
    created_at: Date;
    updated_at: Date;
}

export class PostSqlModel {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    blogId: number;
    createdAt: Date;
    updatedAt: Date;

    static mapToModel(
        row: PostDbRow
    ): PostSqlModel {
        return {
            id: row.id,
            title: row.title,
            shortDescription: row.short_description,
            content: row.content,
            blogId: row.blog_id,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

export class PostDbRowWithBlogName extends PostDbRow {
    blog_name: string
}

export class PostSqlModelWithBlogName extends PostSqlModel {
    blogName: string

    static override mapToModel(
        row: PostDbRowWithBlogName
    ): PostSqlModelWithBlogName {
        return {
            ...super.mapToModel(row),
            blogName: row.blog_name
        }
    }
}