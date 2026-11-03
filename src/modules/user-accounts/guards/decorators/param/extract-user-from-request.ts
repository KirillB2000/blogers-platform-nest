import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const ExtractUserFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const user = request.user

        return user || undefined
    }
)