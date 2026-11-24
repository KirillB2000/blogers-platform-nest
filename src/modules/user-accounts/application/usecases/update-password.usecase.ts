import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { NewPasswordRecoveryAppDto } from "../dto/new-password.app-dto.js";
import { UsersRepository } from "../../infrastructure/users.repository.js";
import { BadRequestException } from "@nestjs/common";
import { PasswordService } from "../adapters/password.service.js";
import { isAfter } from "date-fns";

export class UpdatePasswordCommand {
    constructor (
        public dto: NewPasswordRecoveryAppDto
    ) {}
}

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordUseCase implements ICommandHandler<UpdatePasswordCommand, void> {
    constructor (
        private usersRepository: UsersRepository,
        private passwordService: PasswordService
    ) {}

    async execute(
        command: UpdatePasswordCommand
    ): Promise<void> {
        const { newPassword, recoveryCode } = command.dto

        const userByRecoveryCode = await this.usersRepository.findUserByRecoveryCode(recoveryCode)

        if (!userByRecoveryCode) {
            throw new BadRequestException([{ message: 'Invalid recovery code', field: 'recoveryCode' }])
        }

        if (!userByRecoveryCode.recoveryExpirationDate || isAfter(new Date(), userByRecoveryCode.recoveryExpirationDate)) {
            throw new BadRequestException([{ message: 'Recovery code is expired', field: 'recoveryCode' }])
        }

        const passwordHash = await this.passwordService.hashPassword(newPassword)

        await this.usersRepository.updatePassword(userByRecoveryCode.id, passwordHash)
    }
}