import { Module } from '@nestjs/common';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module.js';
import { CommentsModule } from './modules/bloggers-platform/comments/comments.module.js';
import { PostsModule } from './modules/bloggers-platform/posts/posts.module.js';
import { BlogsModule } from './modules/bloggers-platform/blogs/blogs.module.js';
import { TestingModule } from './modules/testing/testing.module.js';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://test:test@ac-ojrvsaj-shard-00-00.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-01.7rebcxk.mongodb.net:27017,ac-ojrvsaj-shard-00-02.7rebcxk.mongodb.net:27017/?ssl=true&replicaSet=atlas-zhxj62-shard-0&authSource=admin&appName=Cluster0'),
    UserAccountsModule,
    CoreModule,
    CommentsModule,
    PostsModule,
    BlogsModule,
    TestingModule
  ],
  providers: [],
})
export class AppModule {}
