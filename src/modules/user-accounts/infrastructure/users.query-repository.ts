import { InjectModel } from "@nestjs/mongoose";
import { User, type UserModelType } from "../domain/user.entity.js";
import { UserViewDto } from "../api/viewDto/users.view-dto.js";
import { NotFoundException } from "@nestjs/common";
import { GetUsersQueryParams } from "../api/inputDto/get-users-query-params.input-dto.js";
import { UsersPaginatedViewDto } from "../api/viewDto/users.paginated.view-dto.js";


export class UsersQwRepo {
    constructor (
        @InjectModel(User.name)
        private UserModel: UserModelType
    ) {}

    async getByIdOrNotFoundFail(
        id: string
    ): Promise <UserViewDto> {
        const user = await this.UserModel.findOne({
            _id: id,
            deletedAt: null
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return UserViewDto.mapToView(user)
    }

    async getAll(
        query: GetUsersQueryParams
    ): Promise<UsersPaginatedViewDto> {

        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchEmailTerm,
            searchLoginTerm
        } = query

        const skip = query.calculateSkip()
        const filter: any = {}
        
        if (searchEmailTerm || searchLoginTerm) {
            filter.$or = [];
            if (searchEmailTerm) {
                filter.$or.push({ email: { $regex: searchEmailTerm, $options: 'i' } })
            }
            if (searchLoginTerm) {
                filter.$or.push({ login: { $regex: searchLoginTerm, $options: 'i' } })
            }
        }

        const result = await this.UserModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .exec()

        const totalCount = await this.UserModel.countDocuments(filter)
        
        const items = result.map(UserViewDto.mapToView)

        return UsersPaginatedViewDto.mapToView({
            items,
            page: pageNumber,
            size: pageSize,
            totalCount
        })
    }
}