import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    async default() {
        return 'Hello world!!'
    }
}
