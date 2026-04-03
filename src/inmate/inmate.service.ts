import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      totalDays: this.calculateDays(
        item.startDate,
        item.releaseDate,
      ).totalDays,
      daysLeft: this.calculateDays(
        item.startDate,
        item.releaseDate,
      ).daysLeft,
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

    if(!data){
      throw new NotFoundException('Inmate profile not found');
    }

    const { totalDays, daysLeft } = this.calculateDays(
      data!.startDate,
      data!.releaseDate,
    );

    const result = {
      ...data,
      profileImage: data?.user?.profileImage ?? "/uploads/inmate/default.jpg",
      totalDays,
      daysLeft,
      user: undefined,
    }

    return result;
  }

  calculateDays(startDate: Date, releaseDate: Date) {
    const now = new Date();

    const totalMs = releaseDate.getTime() - startDate.getTime();
    const leftMs = releaseDate.getTime() - now.getTime();

    const totalDays = Math.max(0, Math.ceil(totalMs / (1000 * 60 * 60 * 24)));
    const daysLeft = Math.max(0, Math.ceil(leftMs / (1000 * 60 * 60 * 24)));

    return { totalDays, daysLeft };
  }
}
