import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    example: 'admin',
    description: 'User ID of the post creator',
  })
  user: string;

  @ApiProperty({
    example: 'History',
    description: 'Category ID the post belongs to',
  })
  category: string;

  @ApiProperty({ example: 'My First Post', description: 'Title of the post' })
  title: string;

  @ApiProperty({
    example: 'This is the full content of the post.',
    description: 'Main post content',
  })
  content: string;
}
