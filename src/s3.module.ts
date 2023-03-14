import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/logger/logger.module';

import { S3Config } from './config/s3.config';
import { S3Controller } from './controllers/s3.controller';
import { S3Service } from './services/s3.service';

@Module({
  imports: [ConfigModule, LoggerModule],
  controllers: [S3Controller],
  providers: [
    //config
    S3Config,

    // services
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
