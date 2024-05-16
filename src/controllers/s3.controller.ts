import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiFileResponse } from '@app/crypto-utils/decorators/api-file-response.decorator';
import { IdParamDto } from '@app/crypto-utils/dto/params/id-param.dto';
import { UploadFileCommand } from '@app/s3/dto/command/upload-file.command';
import { Response } from 'express';
import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { RequestInterface } from 'src/modules/auth/interfaces/request.interface';

import { S3_ROUT_PREFIX, S3Service } from '../services/s3.service';

@ApiTags(S3_ROUT_PREFIX.toUpperCase())
@Controller(S3_ROUT_PREFIX)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get file by id',
    description: 'This route can call all users',
  })
  @ApiFileResponse('image/png', 'image/*')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Image not found',
  })
  async getFileById(
    @Param() param: IdParamDto,
    @Res() res: Response,
  ): Promise<void> {
    const body = await this.s3Service.getObject(param.id);

    this.s3Service.setUploadRes(res, body);
  }

  @Get(':id/url')
  @ApiOperation({
    summary: 'Get file url by id',
    description: 'This route can call all users',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'Return url to file',
  })
  getFileUrl(@Param() param: IdParamDto): string {
    return this.s3Service.getFileUrl(param.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Upload file',
    description: 'This route can call admin or user',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: String,
    description: 'Return uploaded file Location (id)',
  })
  @UseInterceptors(FileInterceptor('img'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        img: {
          type: 'string',
          format: 'binary',
        },
        id: {
          example: 'primaPramac_5',
          type: 'string',
        },
      },
      required: ['id', 'img'],
    },
  })
  async uploadFile(
    @UploadedFile() img: Express.Multer.File,
    @Request() { user }: RequestInterface,
    @Body() body: UploadFileCommand,
  ): Promise<string> {
    const key = this.s3Service.getKey(body.id, user.id, user.role);

    return this.s3Service.uploadFile(key, img);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete file',
    description: 'This route can call admin or user',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'Return status deleted file',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'File not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied',
  })
  async deleteFile(
    @Request() { user }: RequestInterface,
    @Param() param: IdParamDto,
  ): Promise<boolean> {
    const key = this.s3Service.getKey(param.id, user.id, user.role);

    return this.s3Service.deleteFile(key);
  }
}
