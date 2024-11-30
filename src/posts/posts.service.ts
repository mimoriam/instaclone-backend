import {
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Express } from 'express';
import { PrismaService } from '../prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: ActiveUserData,
    image: Express.Multer.File,
  ) {
    const { caption, filter } = createPostDto;

    if (!image) {
      throw new NotAcceptableException();
    }

    // * TODO (Thumbnail):
    // * TODO (Hashtag):

    const userFound = await this.prisma.user.findUnique({
      where: {
        id: user.sub.toString(),
      },
    });

    if (!userFound) {
      throw new UnauthorizedException();
    }

    if (userFound.id !== user.sub.toString() && user.role !== Role.ADMIN) {
      throw new UnauthorizedException();
    }

    return this.prisma.post.create({
      data: {
        image: image.filename,
        thumbnail: '',
        hashtags: [],
        filter: filter,
        caption: caption,
        authorId: userFound.id,
      },
    });
  }
}
