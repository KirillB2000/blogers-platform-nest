import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../infrastructure/sercurity-devices.repository.js";
import { UnauthorizedException } from "@nestjs/common";

export class LogoutCommand {
    constructor (
        // all three parametrs came from jwt refresh strategy
        public userId: string,
        public deviceId: string,
        public iat: number
    ) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand, void> {
    constructor (
        private securityDevicesRepository: SecurityDevicesRepository 
    ) {}

    async execute(
        command: LogoutCommand
    ): Promise<void> {
        const { deviceId, iat, userId } = command

        const issuedAt = iat * 1000


        const isDeleted = await this.securityDevicesRepository.delete(userId, deviceId, issuedAt)

        if (!isDeleted) {
            throw new UnauthorizedException('Unauthorized')
        }
    }
}