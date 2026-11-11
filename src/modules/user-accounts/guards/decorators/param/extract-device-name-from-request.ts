import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const ExtractDeviceNameFromReq = createParamDecorator (
    (data: unknown, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest() as Request

        const deviceName = req.headers['user-agent'] || 'Unknown device'

        return deviceName
    }
)