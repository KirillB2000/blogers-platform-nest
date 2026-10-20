import { BadRequestException, INestApplication, ValidationError, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "../exception.filter.js";

export function appSetup(app: INestApplication) {
    
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true,

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
    //app.setGlobalPrefix('api')
}