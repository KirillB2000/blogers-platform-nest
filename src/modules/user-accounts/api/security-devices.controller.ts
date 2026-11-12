import { Controller, Delete, Get, HttpCode, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtRefreshAuthGuard } from "../guards/refresh/jwt-refresh.guard.js";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.js";
import { RefreshUserContextDto } from "../guards/dto/refresh-user-context.dto.js";
import { DevicesViewModel } from "./viewDto/devices.view-dto.js";
import { SecurityDevicesQueryRepository } from "../infrastructure/sercurity-devices.query-repository.js";
import { DeleteAllExceptActiveCommand } from "../application/usecases/securityDevices/delete-all-except-active.usecase.js";
import { DeleteSpecificSessionCommand } from "../application/usecases/securityDevices/delete-specific-session.usercase.js";


@Controller('security/devices')
export class SecurityDevicesController {
    
    constructor (
        private commandBus: CommandBus,
        private secDevicesQwRepo: SecurityDevicesQueryRepository
    ) {}

    @UseGuards(JwtRefreshAuthGuard)
    @Get()
    async getAll(
        @ExtractUserFromRequest() user: RefreshUserContextDto
    ): Promise<DevicesViewModel[]> {
        const devicesList = await this.secDevicesQwRepo.getAll(user.userId)

        return devicesList
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAllExceptActive (
        @ExtractUserFromRequest() user: RefreshUserContextDto
    ): Promise<void> {
        await this.commandBus.execute<DeleteAllExceptActiveCommand, void>(new DeleteAllExceptActiveCommand(user.userId, user.deviceId))
    }

    @UseGuards(JwtRefreshAuthGuard)
    @Delete(':deviceId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteSpecificSession (
        @ExtractUserFromRequest() user: RefreshUserContextDto,
        @Param('deviceId') deviceId: string
    ): Promise<void> {
        await this.commandBus.execute<DeleteSpecificSessionCommand, void>(new DeleteSpecificSessionCommand(user.userId, deviceId))
    }
}