import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { Comment } from './comment/entities/comment.entity';
import { CommentsModule } from './comment/comment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ทำให้ใช้ได้ทุกที่โดยไม่ต้อง import ซ้ำ
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.01',
      port: 3306,
      username: 'root',
      password: 'MyStrongPass123!',
      database: 'board',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // ตั้ง true แค่ dev mode เท่านั้น!
    }),
    TypeOrmModule.forFeature([Comment]),
    PostsModule,
    UsersModule,
    CommentsModule,
    // TypeOrmModule.forFeature([User]) // เพิ่มตรงนี้ใน module เฉพาะ
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
