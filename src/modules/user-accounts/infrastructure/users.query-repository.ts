import { UserViewDto } from "../api/viewDto/users.view-dto.js";
import { NotFoundException } from "@nestjs/common";
import { GetUsersQueryParams } from "../api/inputDto/get-users-query-params.input-dto.js";
import { UsersPaginatedViewDto } from "../api/viewDto/users.paginated.view-dto.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UsersSortBy } from "../api/inputDto/users-sort-by.js";
import { SortDirection } from "../../../core/dto/base.query-params.input-dto.js";


export class UsersQwRepo {
    constructor (
        @InjectDataSource() private dataSource: DataSource
    ) {}

    async getByIdOrNotFoundFail(
        id: number
    ): Promise <UserViewDto> {
        const usersRows = await this.dataSource.query(
            `
            SELECT id, login, email, created_at
            FROM "users"
            WHERE "id"=$1

            `,
            [id]
        )

        const userRow = usersRows[0]

        if (!userRow) {
            throw new NotFoundException('User not found')
        }

        const userViewModel: UserViewDto = {
            id: userRow.id.toString(),
            login: userRow.login,
            email: userRow.email,
            createdAt: userRow.created_at
        }

        return userViewModel
    }

    async getAll(
        query: GetUsersQueryParams
    ): Promise<UsersPaginatedViewDto> {

        let {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchLoginTerm,
            searchEmailTerm
        } = query

        const skip = query.calculateSkip()

        // Create whenClause for search terms

        const conditions: string[] = []
        const params: any[] = []

        if (searchLoginTerm) {
            params.push(`%${searchLoginTerm}%`)
            conditions.push(`login ILIKE $${params.length}`)
        }


        if (searchEmailTerm) {
            params.push(`%${searchEmailTerm}%`)
            conditions.push(`email ILIKE $${params.length}`)
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' OR ')}` : ''

        // Create variables for order by to defending of injections?

        const safeSortBy = Object.values(UsersSortBy).includes(sortBy)
            ? sortBy
            : UsersSortBy.CreatedAt;
        const safeSortDirection = sortDirection === SortDirection.Asc ? 'asc' : 'desc';
        
        const usersRows = await this.dataSource.query(
            `
            SELECT id, login, email, created_at
            FROM "users"
            ${whereClause}
            ORDER BY ${safeSortBy} ${safeSortDirection}
            LIMIT $${params.length + 1}
            OFFSET $${params.length + 2}
            
            `,
            [...params, pageSize, skip]
        )

        const totalCountArr = await this.dataSource.query(
            `
                SELECT COUNT(*)
                FROM "users"
                ${whereClause}
            `,
            [...params]
        )
        const totalCount = totalCountArr[0].count
        
        const items: UserViewDto[] = usersRows.map((userRow: any) => {
            return {
                id: userRow.id.toString(),
                login: userRow.login,
                email: userRow.email,
                createdAt: userRow.created_at 
            }
        })

        return UsersPaginatedViewDto.mapToView({
            items,
            page: pageNumber,
            size: pageSize,
            totalCount
        })
    }
}