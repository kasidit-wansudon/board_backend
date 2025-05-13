import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'admin',
    description: 'User ID of the User creator',
  })
  username: string;

  @ApiProperty({
    example: 'https://i.pravatar.cc/150?img=5',
    description: 'Avatar image URL',
  })
  avatar_url: string;
}
