import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto1/comment-dto';
import { UpdateCommentDto } from './dto1/update-comment-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Comment } from './comments.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':poemType/:poemId')
  async findAll(
    @Param('poemType') poemType: string,
    @Param('poemId') poemId: number,
  ): Promise<Comment[]> {
    return this.commentsService.findAll(poemType, poemId);
  }

  @Post(':poemType/:poemId')
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('poemType') poemType: string,
    @Param('poemId') poemId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req,
  ): Promise<Comment> {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User data not found in request');
    }

    if (!user.firstName || !user.lastName) {
      throw new UnauthorizedException('Incomplete user data');
    }

    createCommentDto.poemType = poemType;
    createCommentDto.poemId = poemId;
    createCommentDto.user = `${user.firstName} ${user.lastName}`;  
    createCommentDto.date = new Date().toISOString(); 

    return this.commentsService.create(createCommentDto);
  }
  
  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req,
  ): Promise<Comment> {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User data not found in request');
    }

    const comment = await this.commentsService.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user !== `${user.firstName} ${user.lastName}`) {
      throw new UnauthorizedException('You are not authorized to update this comment');
    }

    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: number,
    @Req() req,
  ) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User data not found in request');
    }

    const comment = await this.commentsService.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    if (comment.user !== `${user.firstName} ${user.lastName}`) {
      throw new UnauthorizedException('You are not authorized to delete this comment');
    }

    return this.commentsService.remove(id);
  }
}