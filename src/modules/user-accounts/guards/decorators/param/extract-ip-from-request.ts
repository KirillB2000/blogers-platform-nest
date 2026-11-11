import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const ExtractIpFromReq = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest() as Request

        const ipAddress = req.ip || 'Unknown ip address'

        return ipAddress
    }
)