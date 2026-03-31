import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaService, MediaServiceV2 } from './media.service';
import { MediaController, MediaControllerV2 } from './media.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [MediaController, MediaControllerV2],
  providers: [MediaService, MediaServiceV2],
})
export class MediaModule {}
