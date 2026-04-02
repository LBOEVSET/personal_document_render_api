import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class InmateService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getAllInmateProfiles() {
    const data = await this.prisma.inmateProfile.findMany({
      include: {
        detail: true,
        user: {
          select: {
            profileImage: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const result = data.map((item) => ({
      ...item,
      profileImage: item.user?.profileImage ?? "/uploads/inmate/default.jpg",
      user: undefined,
    }));

    return result;
  }

  async getInmateProfileById(id: string, user: any) {
    const data =  await this.prisma.inmateProfile.findUnique({
      where: { id },
      include: {
        detail: true,
        user: {
          select: {
            profileImage: true,
          },
        },
      },
    });

    if(user.role !== 'ADMIN' && data?.userId !== user.id) {
      throw new UnauthorizedException('You do not have access to this inmate profile');
    }

    const result = {
      ...data,
      profileImage: data?.user?.profileImage ?? "/uploads/inmate/default.jpg",
      user: undefined,
    }

    return result;
  }

  async getAllInmateDetails() {
    const data = await this.prisma.inmateDetail.findMany({
      orderBy: { id: 'desc' },
      include: {
        inmate: {
          include: {
            user: {
              select: {
                profileImage: true,
              },
            },
          },
        },
      },
    });
    const result = data.map((item) => ({
      ...item,
      profileImage: item.inmate?.user?.profileImage ?? "/uploads/inmate/default.jpg",
      inmate: undefined,
    }));

    return result;
  }

  async getInmateDetailById(id: string) {
    const data = await this.prisma.inmateDetail.findUnique({
      where: { id },
      include: {
        inmate: {
          include: {
            user: {
              select: {
                profileImage: true,
              },
            },
          },
        },
      },
    });

    const result = {
      ...data,
      profileImage: data?.inmate?.user?.profileImage ?? "/uploads/inmate/default.jpg",
      inmate: undefined,
    };

    return result;
  }
}
