import { INestApplication, ValidationPipe } from "@nestjs/common";

export function appSetup(app: INestApplication) {
    
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            stopAtFirstError: true
        })
    )

    app.enableCors()
    //app.setGlobalPrefix('api')
}