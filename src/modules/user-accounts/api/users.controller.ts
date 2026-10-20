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
import { UsersService } from '../application/users.service.js';
import { UserInputModel } from './inputDto/uesrs.input-dto.js';
import { UserViewDto } from './viewDto/users.view-dto.js';
import { UsersQwRepo } from '../infrastructure/users.query-repository.js';
import { GetUsersQueryParams } from './inputDto/get-users-query-params.input-dto.js';
import { UsersPaginatedViewDto } from './viewDto/users.paginated.view-dto.js';
import { AuthGuard } from '../../../auth.guard.js';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor (
        private usersQwRepository: UsersQwRepo,
        private usersService: UsersService
    ) {}

    @Post()
    async createUser(
        @Body() body: UserInputModel
    ): Promise<UserViewDto> {
        const userId = await this.usersService.createUser(body)

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
        return this.usersService.deleteUser(id)
    }
}
