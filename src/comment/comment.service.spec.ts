import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommentsService } from './comment.service';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: Partial<Repository<Comment>>;
  let mockQueryBuilder: any;
  const mockComment = {
    id: 1,
    text: 'c1',
    post_id: 7,
    created_by: 'u1',
    created_at: new Date(),
  } as Comment;
  const mockComments = [mockComment];

  beforeEach(async () => {
    // Mock QueryBuilder for findByPost
    mockQueryBuilder = {
      leftJoinAndMapOne: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(mockComments),
    };
    // Mock repository
    repo = {
      create: jest.fn().mockReturnValue(mockComment),
      save: jest.fn().mockResolvedValue(mockComment),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
      findOneBy: jest.fn().mockResolvedValue(mockComment),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: repo },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByPost', () => {
    it('should return comments for a given post', async () => {
      const postId = 7;
      const result = await service.findByPost(postId);
      expect(repo.createQueryBuilder).toHaveBeenCalledWith('comment');
      expect(mockQueryBuilder.leftJoinAndMapOne).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'comment.post_id = :postId',
        { postId },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'comment.created_at',
        'DESC',
      );
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockComments);
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const id = 1;
      const result = await service.findOne(id);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockComment);
    });
  });

  describe('create', () => {
    it('should create and save a comment', async () => {
      const dto = { text: 'c1', post_id: 7, created_by: 'u1' };
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(mockComment);
      expect(result).toEqual(mockComment);
    });
  });

  describe('update', () => {
    it('should update a comment and return the updated comment', async () => {
      const id = 1;
      const dto = { text: 'updated' };
      const result = await service.update(id, dto);
      expect(repo.update).toHaveBeenCalledWith(id, dto);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id });
      expect(result).toEqual(mockComment);
    });
  });

  describe('remove', () => {
    it('should delete a comment', async () => {
      const id = 1;
      await service.remove(id);
      expect(repo.delete).toHaveBeenCalledWith(id);
    });
  });
});
