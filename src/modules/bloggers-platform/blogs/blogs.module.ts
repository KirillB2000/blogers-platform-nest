import { Module } from '@nestjs/common';
import { BlogsController } from './api/blogs.controller.js';
import { BlogsService } from './application/blogs.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './domain/blogs.entity.js';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Blog.name, schema: BlogSchema}])
  ],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
