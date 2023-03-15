import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiFileResponse } from '@app/crypto-utils/decorators/api-file-response.decorator';
import { wrongRequestApiResource } from '@app/crypto-utils/documentation/wrong-request-api-response';
import { IdParamDto } from '@app/crypto-utils/dto/id-param.dto';
import { UploadFileCommand } from '@app/s3/dto/command/upload-file.command';
import { Response } from 'express';
import { JwtAccessGuard } from 'src/modules/auth/guards/jwt-access.guard';
import { RequestInterface } from 'src/modules/auth/interfaces/request.interface';

import { S3_ROUT_PREFIX, S3Service } from '../services/s3.service';

@ApiTags('S3')
@Controller(S3_ROUT_PREFIX)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get file by id',
    description: 'This route can call all users',
  })
  @ApiResponse(wrongRequestApiResource)
  @ApiFileResponse('image/png', 'image/*')
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
  @ApiResponse(wrongRequestApiResource)
  @ApiOkResponse({ type: String })
  getFileUrl(@Param() param: IdParamDto): string {
    return this.s3Service.getFileUrl(param.id);
  }

  @Post()
  @ApiOperation({
    summary: 'Upload file',
    description: 'This route can call admin or user',
  })
  @UseGuards(JwtAccessGuard)
  @ApiResponse(wrongRequestApiResource)
  @ApiOkResponse({ type: String })
  @UseInterceptors(FileInterceptor('img'))
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
  @ApiResponse(wrongRequestApiResource)
  @ApiOkResponse({ type: Boolean })
  async deleteFile(
    @Request() { user }: RequestInterface,
    @Param() param: IdParamDto,
  ): Promise<boolean> {
    const key = this.s3Service.getKey(param.id, user.id, user.role);

    return this.s3Service.deleteFile(key);
  }
}
