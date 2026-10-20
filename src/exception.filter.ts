import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        if (status === 400) {
            let errorResponse: { errors: { message: string, field: string }[] } = {
                errors: []
            };

            const responseBody: any = exception.getResponse();

            // Безопасно проверяем, что нам пришло в ответе
            if (typeof responseBody === 'string') {
                errorResponse.errors.push({ message: responseBody, field: 'global' });
            } else if (responseBody && typeof responseBody === 'object') {
                const message = responseBody.message;

                if (Array.isArray(message)) {
                    // Если это массив объектов из нашего ValidationPipe
                    errorResponse.errors.push(...message);
                } else if (typeof message === 'string') {
                    // Если это ручная ошибка вида throw new BadRequestException('Ошибка')
                    errorResponse.errors.push({ message: message, field: 'global' });
                }
            }

            response.status(status).json(errorResponse);
        } else {
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url
            });
        }
    }
}