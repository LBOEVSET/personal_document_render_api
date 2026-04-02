import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService, MenuServiceV2 } from './menu.service';
import { MenuController } from './menu.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [MenuController],
  providers: [MenuService, MenuServiceV2],
})
export class MenuModule {}
