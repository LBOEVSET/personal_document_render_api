import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { InmateModule } from './inmate/inmate.module';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtStrategy } from './auth/jwt.strategy';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { LoggerModule } from './core/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { MediaModule } from './media/media.module';
import { MenuModule } from './menu/menu.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    PrismaModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' }, //token expired
      }),
    }),
    AuthModule,
    InmateModule,
    MediaModule,
    MenuModule,
    AdminModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
