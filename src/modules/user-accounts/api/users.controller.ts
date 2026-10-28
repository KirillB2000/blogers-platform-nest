import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    HttpCode, 
    HttpStatus, 
    Param, 
    Post, 
    Query, 
    UseGuards
} from '@nestjs/common';
import { UserInputModel } from './inputDto/uesrs.input-dto.js';
import { UserViewDto } from './viewDto/users.view-dto.js';
import { UsersQwRepo } from '../infrastructure/users.query-repository.js';
import { GetUsersQueryParams } from './inputDto/get-users-query-params.input-dto.js';
import { UsersPaginatedViewDto } from './viewDto/users.paginated.view-dto.js';
import { BasicAuthGuard } from '../guards/basic/basic-auth.guard.js';
import { CreateUserCommand } from '../application/usecases/create-user.usecase.js';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase.js';

@UseGuards(BasicAuthGuard)
@Controller('users')
export class UsersController {
    constructor (
        private usersQwRepository: UsersQwRepo,
        private commandBus: CommandBus
    ) {}

    @Post()
    async createUser(
        @Body() body: UserInputModel
    ): Promise<UserViewDto> {
        const userId = await this.commandBus.execute<CreateUserCommand, string>(new CreateUserCommand(body))

        return this.usersQwRepository.getByIdOrNotFoundFail(userId)
    }

    @Get()
    async getUserList(
        @Query() query: GetUsersQueryParams
    ): Promise<UsersPaginatedViewDto> {
        return this.usersQwRepository.getAll(query)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(
        @Param('id') id: string
    ): Promise<void> {
        return await this.commandBus.execute<DeleteUserCommand, void>(new DeleteUserCommand(id))
    }
}
