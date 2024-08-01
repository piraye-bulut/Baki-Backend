import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comments.entity';
import { CreateCommentDto } from './dto1/comment-dto';
import { UpdateCommentDto } from './dto1/update-comment-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async findAll(poemType: string, poemId: number): Promise<Comment[]> {
    return this.commentsRepository.find({ where: { poemType, poemId } });
  }

  async findById(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto);
    return await this.commentsRepository.save(comment);
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    await this.commentsRepository.update(id, updateCommentDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    await this.commentsRepository.remove(comment);
  }
}