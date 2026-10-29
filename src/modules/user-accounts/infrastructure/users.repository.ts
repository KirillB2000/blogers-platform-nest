import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, type UserModelType } from "../domain/user.entity.js";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
    
    async save(user: UserDocument) {
        await user.save();
    }

    async deleteById(
        id: string
    ): Promise<boolean> {
        const deletionResult = await this.UserModel.deleteOne({ id: id })

        return deletionResult.deletedCount > 0
    }

    async findById (
        id: string
    ): Promise<UserDocument | null> {
        const userDoc = this.UserModel.findOne({_id: id}).lean()

        return userDoc
    }

    async findOrNotFoundFail(
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
        const countsOfUsers = await this.UserModel.countDocuments({id: userId})

        return countsOfUsers > 0
    }
}