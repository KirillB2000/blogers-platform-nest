import { BadRequestException, INestApplication, ValidationError, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "../httpExceptionFilter.filter.js";
import cookieParser from "cookie-parser";

export function appSetup(app: INestApplication) {
    
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,

            exceptionFactory: (errors) => {
                const errorsForResponse: {message: string, field: string}[] = []

                errors.forEach((e: ValidationError) => {
                    if (e.constraints) {
                        const constraintsKeys = Object.keys(e.constraints)

                        const firstKey = constraintsKeys[0];

                        errorsForResponse.push({
                            message: e.constraints[firstKey],
                            field: e.property
                        })
                    }
                })

                return new BadRequestException(errorsForResponse)
            }
        })
    )

    app.useGlobalFilters(new HttpExceptionFilter())

    app.enableCors()
    app.use(cookieParser())

    const expressApp = app.getHttpAdapter().getInstance()
    
    if (expressApp && typeof expressApp.set === 'function') {
        expressApp.set('trust proxy', true)
    }
}