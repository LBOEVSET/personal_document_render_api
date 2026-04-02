import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getMainMenu() {
    return this.prisma.mainMenu.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getAllLegalCategories() {
    return this.prisma.legalMenu.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getAllPrDepartments() {
    return this.prisma.pRPracticeMenu.findMany({
      orderBy: { order: 'asc' },
    });
  }

}

@Injectable()
export class MenuServiceV2 {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getMainMenu() {
    return this.prisma.mainMenu.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getAllLegalCategories() {
    return this.prisma.legalMenu.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async getAllPrDepartments() {
    return this.prisma.pRPracticeMenu.findMany({
      orderBy: { order: 'asc' },
    });
  }
}
