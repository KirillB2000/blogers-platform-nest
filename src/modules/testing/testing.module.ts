import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller.js';

@Module({
    imports: [],
    controllers: [TestingController]
})
export class TestingModule {}
