import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../../infrastructure/sercurity-devices.repository.js";

export class DeleteSpecificSessionCommand {
    constructor (
        public userId: string,
        public deviceId: string,
    ) {}
}

@CommandHandler(DeleteSpecificSessionCommand)
export class DeleteSpecificSessionUseCase implements ICommandHandler<DeleteSpecificSessionCommand, void> {

    constructor (
        private securityDevicesRepository: SecurityDevicesRepository
    ) {}

    async execute(
        command: DeleteSpecificSessionCommand
    ): Promise<void> {
        const { userId, deviceId } = command

        const sessionByDeivceIdParam = await this.securityDevicesRepository.findByDeviceId(deviceId)

        if (!sessionByDeivceIdParam) {
            throw new NotFoundException('Session not found')
        }

        if (sessionByDeivceIdParam.userId !== userId) {
            throw new ForbiddenException("You don't have permission to terminate this session")
        }

        await this.securityDevicesRepository.deleteByDeviceId(deviceId)

    }
}