import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityDevicesRepository } from "../../../infrastructure/sercurity-devices.repository.js";

export class DeleteAllExceptActiveCommand {
    constructor (
        public userId: string,
        public deviceId: string
    ) {}
}

@CommandHandler(DeleteAllExceptActiveCommand)
export class DeleteAllExceptActiveUseCase implements ICommandHandler<DeleteAllExceptActiveCommand, void> {
    
    constructor (
        private securityDevicesRepository: SecurityDevicesRepository
    ) {}

    async execute(
        command: DeleteAllExceptActiveCommand
    ): Promise<void> {
        const { userId, deviceId } = command

        await this.securityDevicesRepository.deleteOtherSessions(userId, deviceId)
    }
}