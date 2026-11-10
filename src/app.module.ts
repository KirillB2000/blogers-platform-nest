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
import { CoreConfig } from './core/core.config.js';

const testingModule = []

if (process.env.NODE_ENV === 'testing') {
  testingModule.push(TestingModule)
}

@Module({
  imports: [
    CoreModule,
    configModule,
    MongooseModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          uri: coreConfig.mongoURI
        }
      },
      inject: [CoreConfig]
    }),
    ThrottlerModule.forRoot([{ ttl: seconds(10), limit: 5  }]),
    CqrsModule.forRoot(),
    UserAccountsModule,
    CommentsModule,
    PostsModule,
    BlogsModule,
    NotificationModule,

    ...testingModule
  ],
  controllers: [AppController],
})
export class AppModule {}
