export class BlogDbRow {
    id: number;
    name: string;
    description: string;
    website_url: string;
    is_membership: boolean;
    created_at: Date;
    updated_at: Date;
}

export class BlogSqlModel {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
    isMembership: boolean;
    createdAt: Date;
    updatedAt: Date;

    static mapToModel(
        row: BlogDbRow
    ): BlogSqlModel {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            websiteUrl: row.website_url,
            isMembership: row.is_membership,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}