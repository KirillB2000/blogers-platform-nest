import { configModule } from './dynamic-config-module.js';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module.js';
import { CommentsModule } from './modules/bloggers-platform/comments/comments.module.js';
import { PostsModule } from './modules/bloggers-platform/posts/posts.module.js';
import { BlogsModule } from './modules/bloggers-platform/blogs/blogs.module.js';
import { TestingModule } from './modules/testing/testing.module.js';
import { AppController } from './app.controller.js';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { seconds, ThrottlerModule } from '@nestjs/throttler'
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(process.env.MONGODB_URI || "mongodb://test:test@ac-ojrvsaj-shard-00-00.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-01.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-02.7rebcxk.mongodb.net:27017/myapp_dev?ssl=true&replicaSet=atlas-zhxj62-shard-0&authSource=admin&appName=Cluster0"),
    ThrottlerModule.forRoot([{ ttl: seconds(10), limit: 5  }]),
    CqrsModule.forRoot(),
    UserAccountsModule,
    CoreModule,
    CommentsModule,
    PostsModule,
    BlogsModule,
    TestingModule,
    NotificationModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
