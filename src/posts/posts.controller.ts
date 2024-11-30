import {
  Body,
  Controller,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import e, { Express, Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@Controller({
  version: '1',
  path: '/posts',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth(AuthType.Bearer)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, callback) => {
          const directory = `./uploads/`;

          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }
          callback(null, directory);
        },
        filename(
          req: e.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) {
          const ext = file.mimetype.split('/')[1];

          callback(null, `user-${Date.now()}.${ext}`);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter(req: Request, file: Express.Multer.File, callback) {
        const whitelist = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!whitelist.includes(file.mimetype)) {
          return callback(
            new UnsupportedMediaTypeException('File is not allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile()
    file: Express.Multer.File,
    @ActiveUser() user: ActiveUserData,
  ) {
    return await this.postsService.createPost(createPostDto, user, file);
  }
}
