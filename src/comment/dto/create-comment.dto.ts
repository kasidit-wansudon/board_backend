// src/comments/dto/create-comment.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a comment.',
    description: 'The text content of the comment.',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    example: 123,
    description: 'The ID of the post associated with this comment.',
  })
  @Type(() => Number)
  @IsNumber()
  post_id: number;

  @ApiProperty({
    example: 'john.doe',
    description: 'The username or identifier of the comment creator.',
  })
  @IsString()
  @IsNotEmpty()
  created_by: string;
}
