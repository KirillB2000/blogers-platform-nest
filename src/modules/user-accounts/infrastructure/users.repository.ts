import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, type UserModelType } from "../domain/user.entity.js";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        @InjectDataSource() private dataSource: DataSource
    ) {}
    
    async save(user: UserDocument) {
        await user.save();
    }

    async createUser (
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
            RETURNING *;
            
            `,
            [login, email, passwordHash]
        )

        const userId = createdUserRow[0].id as number

        return userId
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



    async findOrNotFoundFail( // Unite into the one method 
        id: string
    ): Promise<UserDocument> {
        const userDoc = await this.UserModel.findById(id)

        if (!userDoc) {
            throw new NotFoundException('User not found')
        }

        return userDoc
    }

    async findByLogin (
        login: string
    ): Promise<UserDocument | null> {
        const userDoc = this.UserModel
            .findOne({
                login: login
            })
            .exec()

        return userDoc
    }

    async findByEmail(
        email: string
    ): Promise<UserDocument | null> {
        const userDoc = await this.UserModel
            .findOne({
                email: email
            })
            .exec()

        return userDoc
    }

    async findUserByConfirmationCode(
        confirmationCode: string
    ): Promise<UserDocument | null> {
        const userDoc = await this.UserModel.findOne({
            'emailConfirmationInfo.confirmationCode': confirmationCode
        })
        .exec()

        return userDoc
    }

    async findByLoginOrEmailField(
        loginOrEmail: string
    ): Promise<UserDocument | null> {
        const userDoc = this.UserModel
            .findOne({
                $or: [{email: loginOrEmail}, {login: loginOrEmail}]
            })
            .exec()

        return userDoc
    }

    async findUserByRecoveryCode(
        recoveryCode: string
    ): Promise<UserDocument | null> {
        const userDoc = await this.UserModel
            .findOne({
                'passwordRecoveryInfo.recoveryCode': recoveryCode
            })
            .exec()

        return userDoc
    }

    async countUsersById(
        userId: string
    ): Promise<boolean> {
        const countsOfUsers = await this.UserModel.countDocuments({_id: userId})

        return countsOfUsers > 0
    }
}