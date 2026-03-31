import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService, MenuServiceV2 } from './menu.service';
import { MenuController, MenuControllerV2 } from './menu.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    ])
  ],
  controllers: [MenuController, MenuControllerV2],
  providers: [MenuService, MenuServiceV2],
})
export class MenuModule {}
