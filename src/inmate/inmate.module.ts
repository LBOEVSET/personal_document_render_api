import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InmateService } from './inmate.service';
import { InmateController } from './inmate.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [InmateController],
  providers: [InmateService],
})
export class InmateModule {}
