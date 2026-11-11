import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthCookies } from "../../../api/inputDto/auth-cookies.js";
import { Request } from "express";

export const ExtractResfreshTokenFromReq = createParamDecorator (
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest() as Request

        const refreshToken = req.cookies as AuthCookies

        return refreshToken
    }
)