import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateUserDomainDto } from "./dto/create-user.domain.js";
import { EmailConfirmation, EmailConfirmationSchema } from "./email-confirmation.schema.js";
import { PasswordRecovery, PasswordRecoverySchema } from "./password-recovery.schema.js";
import { randomUUID } from "crypto";
import { add, isAfter } from 'date-fns'
import { BadRequestException } from "@nestjs/common";

@Schema({ timestamps: true })
export class User {

    @Prop({
        type: String, 
        required: true,
        unique: true
    })
    login: string

    @Prop({
        type: String,
        required: true
    })
    passwordHash: string

    @Prop({
        type: String,
        required: true,
        unique: true
    })
    email: string

    @Prop({
        type: EmailConfirmationSchema,
        required: true
    })
    emailConfirmationInfo: EmailConfirmation

    @Prop({
        type: PasswordRecoverySchema,
        required: true
    })
    passwordRecoveryInfo: PasswordRecovery


    createdAt: Date
    updatedAt: Date

    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this()
        user.email = dto.email
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;
        
        user.emailConfirmationInfo = {
            confirmationCode: randomUUID() as string,
            expirationDate: add(new Date(), { minutes: 5 }),
            isConfirmed: false
        },
        user.passwordRecoveryInfo = {
            recoveryCode: null,
            expirationDate: null
        }

        return user as UserDocument // <== we need to use type casting (as UserDocument), because typescript defines it as User class
    }
    confirmEmail() {
        if (this.emailConfirmationInfo.isConfirmed) {
            throw new BadRequestException([{ message: 'Email already confirmed', field: 'code' }])
        }

        if (isAfter(new Date(), this.emailConfirmationInfo.expirationDate)) {
            throw new BadRequestException([{ message: 'Code expired', field: 'code' }])
        }

        this.emailConfirmationInfo.isConfirmed = true
    }

    updateConfirmationCode () {
        if (this.emailConfirmationInfo.isConfirmed) {
            throw new BadRequestException([{ message: 'Email already confirmed', field: 'email' }])
        }

        this.emailConfirmationInfo.confirmationCode = randomUUID() as string
        this.emailConfirmationInfo.expirationDate = add(new Date(), { minutes: 5 })
    }

    updateRecoveryCode (): string {
        const code = randomUUID() as string
        
        this.passwordRecoveryInfo.recoveryCode = code
        this.passwordRecoveryInfo.expirationDate = add(new Date(), { minutes: 5 })

        return code
    }

    updatePasswordByRecoveryCode() {
        if (this.passwordRecoveryInfo.expirationDate! < new Date()) {
            throw new BadRequestException([{ message: 'Recovery code is expired', field: 'recoveryCode' }])
        }

        
    }
}

export const UserSchema = SchemaFactory.createForClass(User) // <== Generate runtime schema with types we declared with @Prop()

UserSchema.loadClass(User) // <== Copy all methods from class User to UserSchema, except static methods  

export type UserDocument = HydratedDocument<User> // <=== Here we have access to all properties and methods of User class expcept static methods

export type UserModelType = Model<UserDocument> & typeof User // <== and here we add access to User's static methods by "& typeof User"
