import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateUserDomainDto } from "./dto/create-user.domain.js";

@Schema({ timestamps: true })
export class User {

    @Prop({
        type: String, 
        required: true
    })
    login: string

    @Prop({
        type: String,
        required: true
    })
    passwordHash: string

    @Prop({
        type: String,
        required: true
    })
    email: string

    createdAt: Date
    updatedAt: Date

    static createInstance(dto: CreateUserDomainDto): UserDocument {
        const user = new this()
        user.email = dto.email
        user.passwordHash = dto.passwordHash;
        user.login = dto.login;

        return user as UserDocument // <== we need to use type casting (as UserDocument), because typescript defines it as User class
    }
}

export const UserSchema = SchemaFactory.createForClass(User) // <== Generate runtime schema with types we declared with @Prop()

UserSchema.loadClass(User) // <== Copy all methods from class User to UserSchema, except static methods  

export type UserDocument = HydratedDocument<User> // <=== Here we have access to all properties and methods of User class expcept static methods

export type UserModelType = Model<UserDocument> & typeof User // <== and here we add access to User's static methods by "& typeof User"