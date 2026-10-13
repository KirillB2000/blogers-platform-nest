import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument, type UserModelType } from "../domain/user.entity.js";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private UserModel: UserModelType) {}
    
    async save(user: UserDocument) {
        await user.save();
    }

    async findById (
        id: string
    ): Promise<UserDocument | null> {
        const userDoc = this.UserModel.findOne({_id: id})

        return userDoc
    }

    async findOrNotFoundFail(
        id: string
    ): Promise<UserDocument> {
        const userDoc = await this.UserModel.findById(id)

        if (!userDoc) {
            throw new NotFoundException('user not found')
        }

        return userDoc
    }

    async delete(
        id: string
    ): Promise<void> {
        await this.UserModel.deleteOne({_id: id})
    }
}