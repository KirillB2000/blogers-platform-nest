import { Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt'

@Injectable()
export class PasswordService {
    async hashPassword(
        password: string
    ): Promise<string> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }

    async verifyPassword(
        password: string,
        hashedPassword: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword)
    }
}