import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, type UserModelType } from "../domain/user.entity.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { UserDbRow, UserSqlModel } from "../domain/user-sql-model.js";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        @InjectDataSource() private dataSource: DataSource
    ) {}
    
    async save(user: UserDocument) {
        await user.save();
    }

    async createUserByAdmin (
        login: string,
        email: string,
        passwordHash: string
    ): Promise<number> {
        const createdUserRow = await this.dataSource.query(
            `
            INSERT INTO users (
                login,
                email,
                password_hash
            )
            VALUES ($1, $2, $3)
            RETURNING id;
            
            `,
            [login, email, passwordHash]
        )

        const userId = createdUserRow[0].id as number

        return userId
    }
    
    async registrateAndCreateUnconfirmedUser (
        login: string, 
        email: string, 
        passwordHash: string,
        confirmationCode: string,
        expirationDate: Date
    ): Promise<void> {
        const createdUserRow = await this.dataSource.query(
            `
            INSERT INTO users (
                login,
                email,
                password_hash,
                confirmation_code,
                confirm_expiration_date
            )
            VALUES ($1, $2, $3, $4, $5)
            
            `,
            [login, email, passwordHash, confirmationCode, expirationDate]
        )
    }

    async deleteById(
        id: number
    ): Promise<boolean> {
        const [deletedRows] = await this.dataSource.query( // deletedRows - это первое из двух значений, которые лежат в массиве, который возвращаемя из query при удалении ([{rows}, affectedCount])
            `
                DELETE FROM users
                WHERE "id"=$1
                RETURNING id

            `,
            [id]
        )

        console.log(deletedRows) 

        return deletedRows.length > 0
    }

    async findById (
        id: string
    ): Promise<UserDocument | null> {
        const userDoc = await this.UserModel.findOne({_id: id}).lean()

        return userDoc
    }



    async findOrNotFoundFail(
        id: number
    ): Promise<UserDbRow> {
        const usersDbRows: UserDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM users
                WHERE id=$1
            `,
            [id]
        )

        if (!usersDbRows[0]) {
            throw new NotFoundException('User not found')
        }

        return usersDbRows[0]
    }

    async findByLogin (
        login: string
    ): Promise<UserSqlModel | null> {
        
        const usersRows: UserDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM users
                WHERE login=$1
            `,

            [login]
        )

        const userByLogin = usersRows[0] ? usersRows[0] : null

        return userByLogin ? UserSqlModel.mapToModel(userByLogin) : null
    }

    async findByEmail(
        email: string
    ): Promise<UserSqlModel | null> {
        const usersRows: UserDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM users
                WHERE email=$1
            `,

            [email]
        )

        const userByEmail = usersRows[0] ? usersRows[0] : null

        return userByEmail ? UserSqlModel.mapToModel(userByEmail) : null
    }

    async findUserByConfirmationCode(
        confirmationCode: string
    ): Promise<UserSqlModel | null> {
        const rows: UserDbRow[] = await this.dataSource.query(
            `

                SELECT * 
                FROM users
                WHERE confirmation_code=$1

            `,

            [confirmationCode]
        )

        const row = rows[0]

        if (!row) return null

        return UserSqlModel.mapToModel(row)
    }

    async findByLoginOrEmailField(
        loginOrEmail: string
    ): Promise<UserSqlModel | null> {
        const usersRows: UserDbRow[] = await this.dataSource.query(
            `
                SELECT *
                FROM users
                WHERE login=$1 OR email=$1
            `,
            [loginOrEmail]
        )

        const userRow = usersRows[0] ? usersRows[0] : null 

        return userRow ? UserSqlModel.mapToModel(userRow) : null
    }

    async findUserByRecoveryCode(
        recoveryCode: string
    ): Promise<UserSqlModel | null> {
        const usersRowsDb: UserDbRow[] = await this.dataSource.query (
            `
                SELECT *
                FROM users
                WHERE recovery_code=$1
            `,
            [recoveryCode]
        )

        const userRowDb = usersRowsDb[0] ? usersRowsDb[0] : null

        return userRowDb ? UserSqlModel.mapToModel(userRowDb) : null
    }

    async countUsersById(
        userId: number
    ): Promise<boolean> {
        const countUsersArr = await this.dataSource.query(
            `
                SELECT COUNT(*)
                FROM users
                WHERE id=$1
            `,
            [userId]
        )

        return Number(countUsersArr[0].count) > 0
    }

    async updateIsConfirmedByUserId (
        id: number
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE users
                SET is_confirmed=true,
                    confirmation_code=NULL,
                    confirm_expiration_date=NULL,
                    updated_at=NOW()
                WHERE id=$1
            `,

            [id]
        )
    }

    async updateConfirmationCode (
        id: number,
        confirmationCode: string,
        expirationDate: Date
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE users
                SET confirmation_code=$2,
                    confirm_expiration_date=$3,
                    updated_at=NOW()
                WHERE id=$1
            `,

            [id, confirmationCode, expirationDate]
        )
    }

    async updateRecoveryCode (
        id: number,
        recoveryCode: string, 
        expirationDate: Date
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE users
                SET recovery_code=$2,
                    recovery_expiration_date=$3,
                    updated_at=NOW()
                WHERE id=$1
            `,
            [id, recoveryCode, expirationDate]
        )
    }

    async updatePassword(
        id: number, 
        passwordHash: string
    ): Promise<void> {
        await this.dataSource.query(
            `
                UPDATE users
                SET password_hash=$2,
                    recovery_code=NULL,
                    recovery_expiration_date=NULL,
                    updated_at=NOW()
                WHERE id=$1
            `,
            [id, passwordHash]
        )
    }
}