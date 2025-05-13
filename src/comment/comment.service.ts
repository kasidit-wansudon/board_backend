// src/comments/comments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepo.create({
      text: dto.text,
      created_by: dto.created_by,
      post: { id: dto.post_id }, // map relation
    });
    return this.commentRepo.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentRepo.find();
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndMapOne(
        'comment.user_info',
        User,
        'user',
        'user.username = comment.created_by',
      )
      .where('comment.post_id = :postId', { postId })
      .orderBy('comment.created_at', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Comment> {
    return this.commentRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateCommentDto): Promise<Comment> {
    await this.commentRepo.update(id, dto);
    return this.commentRepo.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.commentRepo.delete(id);
  }
}
