import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, LoginInmateDto } from './dto/login.dto';
import { PrismaService } from '../core/prisma/prisma.service';
import { RefreshTokenDto, LogOutDto } from './dto/login.dto';
import { RegisterDto, RegisterInmateUserDto, VerifyRegisterInmateUserDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';
import * as XLSX from 'xlsx';
import { InmateProfile } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { username, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { username: username } });
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

  async loginInmate(dto: LoginInmateDto) {
    const { userId, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
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
      expiresIn: '30m', //token expired
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d', //refresh token expired
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

    const hashedAccessToken = await bcrypt.hash(
      tokens.accessToken,
      10,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: { accessToken: hashedAccessToken },
    });

    return { accessToken: tokens.accessToken };
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

  async registerInmate(dto: RegisterInmateUserDto) {
    const exists = await this.prisma.user.findFirst({
      where: { id: dto.id }
    })

    if (exists) {
      throw new BadRequestException("Email or username already taken")
    }

    const passwordHash = await bcrypt.hash(process.env.PASSWORD || 'password_key', 10)

    const user = await this.prisma.user.create({
      data: {
        id: dto.id,
        username: dto.username ?? "",
        passwordHash,
        role: UserRole.INMATE,
        profileImage: dto.profileImage || null,
        name: dto.name,
        status: 1,
        isVerified: true,
      }
    })

    return user;
  }

  async verifyRegisterInmate(dto: VerifyRegisterInmateUserDto) {
    const exists = await this.prisma.inmateProfile.findFirst({
      where: { 
        OR: [
          { id: dto.id },
          { name: dto.name },
        ],
      }
    })
    console.log(dto);
    console.log('exists user');
    console.log(exists);

    if(!exists){
      throw new NotFoundException('Inmate profile not found');
    }

    const passwordHash = await bcrypt.hash(process.env.PASSWORD || 'password_key', 10)

    const user = await this.prisma.user.create({
      data: {
        id: dto.userId,
        username: dto.id ?? "",
        passwordHash,
        role: UserRole.INMATE,
        name: exists!.name,
        status: 1,
        isVerified: true,
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

  async upsertInmateData(dto: any) {
    return this.prisma.$transaction(async (tx) => {
      return tx.inmateProfile.upsert({
        where: {
          id: dto.id,
        },
        update: {
          name: dto.name,
          status: dto.status,
          cases: dto.cases,
          caseType: dto.caseType,
          category: dto.category ?? '',
          sentence: dto.sentence,

          startDate: new Date(dto.startDate),
          transferFrom: dto.transferFrom ?? '',
          releaseDate: new Date(dto.releaseDate),

          progressStep: dto.progressStep ?? 1,

          imprisonDate: dto.imprisonDate ? new Date(dto.imprisonDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          lastDate: dto.lastDate ? new Date(dto.lastDate) : null,

          sequestrationType: dto.sequestrationType ?? '',
          department: dto.department ?? '',

          profileImage: dto.profileImage ?? null,

          ...(dto.userId && {
            user: {
              connect: { id: dto.userId },
            },
          }),

          ...(dto.detail && {
            detail: {
              upsert: {
                update: {
                  age: dto.detail.age,
                  ageTotal: dto.detail.ageTotal ?? 0,
                  nationality: dto.detail.nationality,
                  religion: dto.detail.religion,
                  holdType: dto.detail.holdType,
                  holdAgency: dto.detail.holdAgency,
                },
                create: {
                  id: `detail-${dto.id}`,
                  age: dto.detail.age,
                  ageTotal: dto.detail.ageTotal ?? 0,
                  nationality: dto.detail.nationality,
                  religion: dto.detail.religion,
                  holdType: dto.detail.holdType,
                  holdAgency: dto.detail.holdAgency,
                },
              },
            },
          }),
        },
        create: {
          id: dto.id,
          name: dto.name,
          status: dto.status,
          cases: dto.cases,
          caseType: dto.caseType,
          category: dto.category ?? '',
          sentence: dto.sentence,

          startDate: new Date(dto.startDate),
          transferFrom: dto.transferFrom ?? '',
          releaseDate: new Date(dto.releaseDate),

          progressStep: dto.progressStep ?? 1,

          imprisonDate: dto.imprisonDate ? new Date(dto.imprisonDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
          lastDate: dto.lastDate ? new Date(dto.lastDate) : null,

          sequestrationType: dto.sequestrationType ?? '',
          department: dto.department ?? '',

          profileImage: dto.profileImage ?? null,

          ...(dto.userId && {
            user: {
              connect: { id: dto.userId },
            },
          }),

          ...(dto.detail && {
            detail: {
              create: {
                id: `detail-${dto.id}`,
                age: dto.detail.age,
                ageTotal: dto.detail.ageTotal ?? 0,
                nationality: dto.detail.nationality,
                religion: dto.detail.religion,
                holdType: dto.detail.holdType,
                holdAgency: dto.detail.holdAgency,
              },
            },
          }),
        },
        include: {
          detail: true,
        },
      });
    });
  }

  async importInmateFromXlsx(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[] = XLSX.utils.sheet_to_json(sheet);

    return this.prisma.$transaction(async (tx) => {
      const results: InmateProfile[] = [];

      for (const row of data) {
        if (!row.id || !row.name) {
          throw new Error(`Invalid row: missing id or name`);
        }

        const inmate = await tx.inmateProfile.create({
          data: {
            id: String(row.id),
            name: row.name,
            status: row.status,
            cases: row.cases ? Number(row.cases) : 1,
            caseType: row.caseType,
            category: row.category ?? '',
            sentence: row.sentence,

            startDate: this.parseThaiDate(row.startDate) || new Date(),
            releaseDate: this.parseThaiDate(row.releaseDate) || new Date(),

            imprisonDate: this.parseThaiDate(row.imprisonDate),
            endDate: this.parseThaiDate(row.endDate),
            lastDate: this.parseThaiDate(row.lastDate),

            transferFrom: row.transferFrom ?? '',
            progressStep: Number(row.progressStep ?? 1),

            userId: null,

            detail: {
              create: {
                id: `detail-${String(row.id)}`,
                age: row.age ?? '',
                ageTotal: this.parseAgeToDays(row.ageTotal),
                nationality: row.nationality ?? '',
                religion: row.religion ?? '',
                holdType: row.holdType ?? '',
                holdAgency: row.holdAgency ?? '',
              },
            },
          },
        });

        results.push(inmate);
      }

      return results;
    });
  }

  parseThaiDate = (value: any): Date | null => {
    if (!value) return null;

    // ถ้าเป็น Date อยู่แล้ว
    if (value instanceof Date) return value;

    // ถ้าเป็น string เช่น 26/08/2570
    if (typeof value === 'string') {
      const parts = value.split('/');
      if (parts.length !== 3) return null;

      let [day, month, year] = parts.map(Number);

      // แปลง พ.ศ. → ค.ศ.
      if (year > 2400) {
        year -= 543;
      }

      return new Date(year, month - 1, day);
    }

    return null;
  };

  parseAgeToDays = (value: string | number | null | undefined): number => {
    if (!value) return 0;

    // ถ้าเป็น number อยู่แล้ว
    if (typeof value === 'number') return value;

    const yearMatch = value.match(/(\d+)\s*ป/);
    const monthMatch = value.match(/(\d+)\s*ด/);
    const dayMatch = value.match(/(\d+)\s*ว/);

    const years = yearMatch ? Number(yearMatch[1]) : 0;
    const months = monthMatch ? Number(monthMatch[1]) : 0;
    const days = dayMatch ? Number(dayMatch[1]) : 0;

    return years * 365 + months * 30 + days;
  };
}
