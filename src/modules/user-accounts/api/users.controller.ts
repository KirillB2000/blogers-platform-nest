import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    Post, 
    Query 
} from '@nestjs/common';
import { UsersService } from '../application/users.service.js';
import { CreateUserInputDto } from './inputDto/uesrs.input-dto.js';
import { UserViewDto } from './viewDto/users.view-dto.js';
import { UsersQwRepo } from '../infrastructure/users.query-repository.js';
import { GetUsersQueryParams } from './inputDto/get-users-query-params.input-dto.js';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto.js';
import { UsersPaginatedViewDto } from './viewDto/users.paginated.view-dto.js';

@Controller('user-accounts')
export class UsersController {
    constructor (
        private usersQwRepository: UsersQwRepo,
        private usersService: UsersService
    ) {}

    @Get()
    async getUserList(
        @Query() query: GetUsersQueryParams
    ): Promise<UsersPaginatedViewDto> {
        return this.usersQwRepository.getAll(query)
    }

    @Post()
    async createUser(
        @Body() body: CreateUserInputDto
    ): Promise<UserViewDto> {
        const userId = await this.usersService.createUser(body)

        return this.usersQwRepository.getByIdOrNotFoundFail(userId)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
        @Param('id') id: string
    ): Promise<void> {
        return this.usersService.deleteUser(id)
    }
}
