import { Injectable, NotFoundException } from '@nestjs/common';
import { LoggerService } from '@app/logger/services/logger.service';
import { ObjectOutputInterface } from '@app/s3/interfaces/object-output.interface';
import AWS from 'aws-sdk';
import { Response } from 'express';
import config from 'src/config';

import { S3Config } from '../config/s3.config';

export const S3_ROUT_PREFIX = 's3';

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

  async getObject(Key: string): Promise<ObjectOutputInterface> {
    const result = await this.s3
      .getObject({ Bucket: this.s3Config.bucketName, Key })
      .promise();

    if (!result.Body) {
      throw new NotFoundException('Image not found');
    }

    return {
      file: result.Body as unknown as Buffer,
      fileName: Key,
      contentType: result.ContentType,
    };
  }

  async uploadFile(key: string, body: Express.Multer.File): Promise<string> {
    try {
      const file = await this.s3
        .upload({
          Bucket: this.s3Config.bucketName,
          Key: key,
          Body: body.buffer,
          ContentType: body.mimetype,
          ACL: 'public-read',
        })
        .promise();

      return file.Location;
    } catch (err: any) {
      throw this.logger.error(err, {
        stack: this.uploadFile.name,
        extra: err,
      });
    }
  }

  getFileUrl(key: string): string {
    return `${config.appUrl}${config.routePrefix}/${S3_ROUT_PREFIX}/${key}`;
  }

  setUploadRes(res: Response, body: ObjectOutputInterface): void {
    res.writeHead(200, {
      'Content-Type': body.contentType || '',
      'Content-Length': body.file.length,
    });

    res.end(body.file);
  }
}
