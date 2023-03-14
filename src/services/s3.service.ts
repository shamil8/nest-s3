import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@app/logger/services/logger.service';
import AWS from 'aws-sdk';
import { Base64String } from 'aws-sdk/clients/wellarchitected';
import config from 'src/config';

import { S3Config } from '../config/s3.config';

@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  constructor(
    private readonly s3Config: S3Config,
    private readonly logger: LoggerService,
  ) {
    AWS.config.update(s3Config.awsConfig);

    this.s3 = new AWS.S3({
      apiVersion: 'latest',
      endpoint: s3Config.endPoint,
      s3ForcePathStyle: true,
    });
  }

  async getObject(Key: string): Promise<Base64String> {
    const result = await this.s3
      .getObject({ Bucket: this.s3Config.bucketName, Key })
      .promise();

    if (!result.Body) {
      throw new NotFoundException('Image not found');
    }

    return result.Body?.toString();
  }

  async postObject(Key: string, Body: any): Promise<string> {
    try {
      const result = await this.s3
        .upload({ Bucket: this.s3Config.bucketName, Key, Body })
        .promise();

      return result.Location;
    } catch (err: any) {
      throw this.logger.error(err, {
        stack: this.postObject.name,
        extra: err,
      });
    }
  }

  getImageUrl(Key: string): string {
    return `${config.appUrl}${config.routePrefix}/s3/${Key}`;
  }
}
