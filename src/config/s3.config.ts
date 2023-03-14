import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsConfigInterface } from '../interfaces/aws-config.interface';

@Injectable()
export class S3Config {
  public bucketName: string;
  public endPoint?: string;
  public awsConfig: AwsConfigInterface;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>(
      'AWS_BUCKET_NAME',
      'app-logo',
    );

    this.endPoint = this.configService.get<string | undefined>(
      'AWS_END_POINT',
      undefined,
    );

    this.awsConfig = {
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'AWS_SECRET_ACCESS_KEY',
      ),
    };
  }
}
