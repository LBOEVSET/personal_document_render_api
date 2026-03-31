import { Injectable } from '@nestjs/common';
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

  async getAllPrSubItem(dto: any) {
    const subMenus = await this.prisma.subPRPracticeMenu.findMany({
      where: {
        ...(dto.mainId && { prId: dto.mainId }),
      },
      orderBy: { order: 'asc' },
    });

    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.mainId && { prId: dto.mainId }),
        ...(dto.department && { department: dto.department }),
      },
    });

    const result: Record<string, any[]> = {};

    // 🔥 ใช้ Map กัน duplicate
    const map: Record<string, Map<string, any>> = {};

    for (const item of items) {
      if (!item.subPrId) continue;

      if (!map[item.subPrId]) {
        map[item.subPrId] = new Map();
      }

      // 🔥 กัน id ซ้ำ
      if (!map[item.subPrId].has(item.id)) {
        map[item.subPrId].set(item.id, {
          id: item.id,
          title: item.title,
          link: item.link ?? null,
          cover: item.cover ?? null,
        });
      }
    }

    // 🔥 map → array ตาม menu
    for (const menu of subMenus) {
      result[menu.id] = map[menu.id]
        ? Array.from(map[menu.id].values())
        : [];
    }

    return result;
  }

  async getAllPrGroupItems(dto: any) {
    if (!dto.prId || !dto.subPrId) {
      throw new Error('prId and subPrId are required');
    }

    // =========================
    // 🔥 GET GROUP MENUS
    // =========================
    const groupMenus = await this.prisma.subGroupPRPracticeMenu.findMany({
      where: {
        subId: dto.subPrId,
      },
      orderBy: { order: 'asc' },
    });

    // =========================
    // 🔥 GET CONTENT ITEMS (STRICT SCOPE)
    // =========================
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.department && { department: dto.department }),

        prId: dto.prId,
        subPrId: dto.subPrId,

        // ❗ ไม่ filter group → เอาทุก group ใน sub นี้
      },
    });

    // =========================
    // 🔥 GROUP + DEDUP
    // =========================
    const result: Record<string, any[]> = {};
    const map: Record<string, Map<string, any>> = {};

    for (const item of items) {
      if (!item.prGroupId) continue;

      if (!map[item.prGroupId]) {
        map[item.prGroupId] = new Map();
      }

      if (!map[item.prGroupId].has(item.id)) {
        map[item.prGroupId].set(item.id, {
          id: item.id,
          title: item.title,
          link: item.link ?? null,
          cover: item.cover ?? null,
        });
      }
    }

    // =========================
    // 🔥 MAP RESULT ตาม MENU ORDER
    // =========================
    for (const menu of groupMenus) {
      result[menu.id] = map[menu.id]
        ? Array.from(map[menu.id].values())
        : [];
    }

    return result;
  }

  async getAllLegalSubCategoriesItem(dto: any) {
    const subMenus = await this.prisma.subLegalMenu.findMany({
      where: {
        ...(dto.mainId && { legalId: dto.mainId }),
      },
      orderBy: { order: 'asc' },
    });

    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.mainId && { legalId: dto.mainId }), // ✅ FIX
        ...(dto.department && { department: dto.department }),
      },
    });

    const result: Record<string, any[]> = {};
    const map: Record<string, Map<string, any>> = {};

    for (const item of items) {
      if (!item.subLegalId) continue;

      if (!map[item.subLegalId]) {
        map[item.subLegalId] = new Map();
      }

      if (!map[item.subLegalId].has(item.id)) {
        map[item.subLegalId].set(item.id, {
          id: item.id,
          title: item.title,
          link: item.link ?? null,
          cover: item.cover ?? null,
        });
      }
    }

    for (const menu of subMenus) {
      result[menu.id] = map[menu.id]
        ? Array.from(map[menu.id].values())
        : [];
    }

    return result;
  }

  async getAllLegalGroupCategoriesItem(dto: any) {
    if (!dto.mainId || !dto.subId) {
      throw new Error('mainId and subId are required');
    }

    // =========================
    // 🔥 GET GROUP MENUS
    // =========================
    const groupMenus = await this.prisma.subGroupLegalMenu.findMany({
      where: {
        subId: dto.subId,
      },
      orderBy: { order: 'asc' },
    });

    // =========================
    // 🔥 GET CONTENT ITEMS (STRICT GROUP SCOPE)
    // =========================
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.department && { department: dto.department }),

        legalId: dto.mainId,
        subLegalId: dto.subId,

        // ❗ ไม่ filter groupId → เอาทุก group ใน sub นี้
      },
    });

    // =========================
    // 🔥 GROUP + DEDUP
    // =========================
    const result: Record<string, any[]> = {};
    const map: Record<string, Map<string, any>> = {};

    for (const item of items) {
      if (!item.legalGroupId) continue;

      if (!map[item.legalGroupId]) {
        map[item.legalGroupId] = new Map();
      }

      // 🔥 กัน duplicate
      if (!map[item.legalGroupId].has(item.id)) {
        map[item.legalGroupId].set(item.id, {
          id: item.id,
          title: item.title,
          link: item.link ?? null,
          cover: item.cover ?? null,
        });
      }
    }

    // =========================
    // 🔥 MAP RESULT ตาม MENU ORDER
    // =========================
    for (const menu of groupMenus) {
      result[menu.id] = map[menu.id]
        ? Array.from(map[menu.id].values())
        : [];
    }

    return result;
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

  async getAllPrSubCategories(dto: any) {
    const subMenus = await this.prisma.subPRPracticeMenu.findMany({
      where: {
        ...(dto.mainId && { prId: dto.mainId }),
      },
      orderBy: { order: 'asc' },
    });

    for (const menu of subMenus) {
      const countItem = await this.prisma.contentItem.count({
        where: {
          department: "PR",
          subPrId: menu.id,
          prGroupId: null,
        },
      });

      const countMenu = await this.prisma.subGroupPRPracticeMenu.count({
        where: {
          subId: menu.id,
        },
      });

      (menu as any).documentCount = countItem;
      (menu as any).subGroupCount = countMenu;
    }

    return subMenus;
  }

  async getAllPrGroupCategories(dto: any) {
    if (!dto.subId) {
      throw new Error('subId is required');
    }

    const groupItems = await this.prisma.subGroupPRPracticeMenu.findMany({
      where: {
        subId: dto.subId,
      },
      orderBy: { order: 'asc' },
    });

    for (const item of groupItems) {
      const count = await this.prisma.contentItem.count({
        where: {
          department: "PR",
          prGroupId: item.id,
        },
      });

      (item as any).documentCount = count;
    }

    return groupItems;
  }

  async getAllLegalSubCategories(dto: any) {
    const subMenus = await this.prisma.subLegalMenu.findMany({
      where: {
        ...(dto.mainId && { legalId: dto.mainId }),
      },
      orderBy: { order: 'asc' },
    });

    for (const menu of subMenus) {
      const countItem = await this.prisma.contentItem.count({
        where: {
          department: "LEGAL",
          subLegalId: menu.id,
          legalGroupId: null,
        },
      });

      const countMenu = await this.prisma.subGroupLegalMenu.count({
        where: {
          subId: menu.id,
        },
      });

      (menu as any).documentCount = countItem;
      (menu as any).subGroupCount = countMenu;
    }

    return subMenus;
  }

  async getAllLegalGroupCategories(dto: any) {
    if (!dto.subId) {
      throw new Error('subId is required');
    }

    const groupItems = await this.prisma.subGroupLegalMenu.findMany({
      where: {
        subId: dto.subId,
      },
      orderBy: { order: 'asc' },
    });

    for (const item of groupItems) {
      const count = await this.prisma.contentItem.count({
        where: {
          department: "LEGAL",
          legalGroupId: item.id,
        },
      });

      (item as any).documentCount = count;
    }

    return groupItems;
  }
}
