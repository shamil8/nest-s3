import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileCommand {
  @ApiProperty({
    description: 'Unique id',
    example: 'OX1BSS',
  })
  @IsNotEmpty()
  @IsString()
  id!: string;
}
