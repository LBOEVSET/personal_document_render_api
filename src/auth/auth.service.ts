import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../core/prisma/prisma.service';
import { RefreshTokenDto, LogOutDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user.username);

    const hashedAccessToken = await bcrypt.hash(tokens.accessToken, 10);
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { 
        accessToken: hashedAccessToken,
        refreshToken: hashedRefreshToken 
      },
    });
    
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  private async generateTokens(username: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    const payload = {
      id: user?.id,
      role: user?.role,
      name: user?.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async refresh(dto: RefreshTokenDto) {
    const { username, refreshToken } = dto;
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access denied');
    }

    const isValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens (ROTATION)
    const tokens = await this.generateTokens(user.username);

    const hashedRefreshToken = await bcrypt.hash(
      tokens.refreshToken,
      10,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken },
    });

    return { refreshToken: tokens.refreshToken };
  }

  async logout(dto: LogOutDto) {
    const { username } = dto;
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) throw new UnauthorizedException();

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });

    return { message: 'Logged out successfully' };
  }

  async registerInmate(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username }
    })

    if (exists) {
      throw new BadRequestException("Email or username already taken")
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        role: UserRole.INMATE,
        profileImage: dto.profileImage || null,
        name: dto.name,
        status: 1
      }
    })

    return user;
  }

  async registerAdmin(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { username: dto.username }
    })

    if (exists) {
      throw new BadRequestException("username already taken")
    }

    if(dto.secret !== process.env.ADMIN_REGISTRATION_SECRET) {
      throw new UnauthorizedException("Invalid registration secret")
    }

    const passwordHash = await bcrypt.hash(dto.password, 10)

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        passwordHash,
        role: UserRole.ADMIN,
        profileImage: dto.profileImage || null,
        name: dto.name,
        status: 1
      }
    })

    return this.generateTokens(user.username)
  }

  async createInmateData(dto: any) {
    return this.prisma.inmateProfile.create({
      data: {
        id: dto.id,
        name: dto.name,
        status: dto.status,
        daysLeft: dto.daysLeft,
        totalDays: dto.totalDays,
        cases: dto.cases,
        caseType: dto.caseType,
        sentence: dto.sentence,
        startDate: dto.startDate,
        transferFrom: dto.transferFrom,
        releaseDate: dto.releaseDate,
        progressStep: dto.progressStep,

        user: {
          connect: {
            id: dto.userId,
          },
        },
        ...(dto.detail && {
          detail: {
            create: {
              id: `detail-${dto.id}`, // auto gen id
              age: dto.detail.age,
              nationality: dto.detail.nationality,
              religion: dto.detail.religion,
              holdType: dto.detail.holdType,
              holdAgency: dto.detail.holdAgency,
            },
          },
        }),
      },
      include: {
        detail: true, // optional: return detail กลับ
      },
    });
  }
}
