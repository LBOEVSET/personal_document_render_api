import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InmateService } from './inmate.service';
import { InmateController, AdminInmateController } from './inmate.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [InmateController, AdminInmateController],
  providers: [InmateService],
})
export class InmateModule {}
