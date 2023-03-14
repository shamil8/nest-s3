import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { wrongRequestApiResource } from '@app/crypto-utils/documentation/wrong-request-api-response';
import { IdParamDto } from '@app/crypto-utils/dto/id-param.dto';
import { Base64String } from 'aws-sdk/clients/wellarchitected';

import { S3Service } from '../services/s3.service';

@ApiTags('S3')
@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Get('/:id')
  @ApiOperation({
    summary: 'Get image by id',
    description: 'This route can call all users',
  })
  @ApiResponse(wrongRequestApiResource)
  @ApiResponse({ type: String })
  async getImage(@Param() param: IdParamDto): Promise<Base64String> {
    return this.s3Service.getObject(param.id);
  }
}
