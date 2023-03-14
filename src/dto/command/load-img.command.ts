import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';

export class LoadImgCommand {
  @ApiProperty({
    description: 'Unique id',
    example: 'OX1BSS',
  })
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({
    description: 'Img',
    example: 'data:image/png;base64,iVBORw0KG...',
  })
  @IsNotEmpty()
  @IsString()
  img!: string;
}
