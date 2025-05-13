import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create({
      ...createPostDto,
      created_at: new Date().toISOString(), // ⏱️ ตั้งเวลาเอง
    });
    await this.postRepository.save(post);
    return { message: 'Post created successfully', data: post };
  }

  async findAll(username): Promise<Post[]> {
    const posts = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndMapOne(
        'post.user_info', // 👈 ชื่อตัวแปรใน entity
        User, // 👈 entity ที่จะ join
        'user', // 👈 alias
        'post.user = user.username', // 👈 เงื่อนไข join (ไม่ใช่ id!)
      )
      .loadRelationCountAndMap('post.commentCount', 'post.comments');
    if (!(username == 0)) {
      posts.where('user.username = :username', { username });
    }
    return posts.orderBy('post.created_at', 'DESC').getMany();
  }

  async findOne(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndMapOne(
        'post.user_info', // 👈 ชื่อตัวแปรใน entity
        User, // 👈 entity ที่จะ join
        'user', // 👈 alias
        'post.user = user.username', // 👈 เงื่อนไข join (ไม่ใช่ id!)
      )
      .loadRelationCountAndMap('post.commentCount', 'post.comments')
      .where('post.id = :id', { id }) // กรองตาม id
      .getOne();
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.preload({
      id,
      ...updatePostDto,
    });
    if (!post) throw new NotFoundException(`Post #${id} not found`);
    await this.postRepository.save(post);
    return { message: 'Post updated', data: post };
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
    return { message: 'Post deleted', data: post };
  }
}
