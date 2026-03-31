import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Department } from '@prisma/client';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getAllInfoGraphics() {
    return this.prisma.infographic.findMany({
      orderBy: { id: 'desc' },
    });
  }

  // async getAllPrSubMenus(dto) {
  //   const subMenus = await this.prisma.subPRPracticeMenu.findMany({
  //     where: {
  //         ...(dto.prId && { prId: dto.prId }),
  //       },
  //     orderBy: { order: 'asc' },
  //   });
  //   const result = {};
  //   for(const menu of subMenus){
  //     const items = await this.prisma.contentItem.findMany({
  //       where: {
  //         prId: menu.prId,
  //       },
  //       orderBy: { id: 'asc' },
  //     });

  //     for(const item of items){
  //       result[item.prId ?? 'default'] = items.map((item) => ({
  //         id: item.id,
  //         title: item.title,
  //         link: item.link ?? null,
  //         cover: item.cover ?? null,
  //       }));
  //     }
  //   }

  //   return result;
  // }

  // async getAllLegalDocuments() {
  //   const docs = await this.prisma.legalDocument.findMany({
  //     where: {

  //     },
  //   });

  //   const grouped: Record<string, any[]> = {};

  //   for (const doc of docs) {
  //     const key = doc.categoryKey;

  //     if (!grouped[key]) {
  //       grouped[key] = [];
  //     }

  //     grouped[key].push({
  //       id: doc.id,
  //       title: doc.title,
  //       type: doc.type,
  //     });
  //   }

  //   return grouped;
  // }

  async getLegalContentItems(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        department: 'LEGAL',
      },
      include: {
        legal: true,
        subLegal: { include: { legal: true } },
        legalGroup: { include: { sub: { include: { legal: true } } } },

        pr: true,
        subPr: { include: { pr: true } },
        prGroup: { include: { sub: { include: { pr: true } } } },
      },
      orderBy: { id: 'asc' },
    });

    const result: Record<string, any[]> = {};

    for (const item of items) {
      let mainKey: string | null = null;

      // =========================
      // 🔥 PRIORITY: group → sub → main
      // =========================

      if (item.legalGroup) {
        mainKey = item.legalGroup.sub.legal.id;
      }

      if (item.prGroup) {
        mainKey = item.prGroup.sub.pr.id;
      }

      if (!mainKey && item.subLegal) {
        mainKey = item.subLegal.legal.id;
      }

      if (!mainKey && item.subPr) {
        mainKey = item.subPr.pr.id;
      }

      if (!mainKey && item.legal) {
        mainKey = item.legal.id;
      }

      if (!mainKey && item.pr) {
        mainKey = item.pr.id;
      }

      if (!mainKey) continue;

      if (!result[mainKey]) result[mainKey] = [];

      let type: 'gallery' | 'vdo' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'gallery';
          break;
        case 'VIDEO':
          type = 'vdo';
          break;
        case 'PDF':
          type = 'pdf';
          break;
        default:
          continue;
      }

      result[mainKey].push({
        id: item.id,
        title: item.title,
        type,
        link: item.link,
        file: item.file ?? undefined,
        coverImage: item.cover ?? undefined,
      });
    }

    return result;
  }

  async getStandardShelfItems(dto: any) {
    const whereBase = {
      ...(dto.mainId && dto.department == 'LEGAL' && { legalId: dto.mainId }),
      ...(dto.subId && dto.department == 'LEGAL' && { subLegalId: dto.subId }),
      ...(dto.groupId && dto.department == 'LEGAL' && { legalGroupId: dto.groupId }),

      ...(dto.mainId && dto.department == 'PR' && { prId: dto.mainId }),
      ...(dto.subId && dto.department == 'PR' && { subPrId: dto.subId }),
      ...(dto.groupId && dto.department == 'PR' && { prGroupId: dto.groupId }),

      ...(dto.department && { department: dto.department }),
    };

    // 🔥 ยิง query พร้อมกัน (เร็วกว่า await ทีละอัน)
    const items = await this.prisma.contentItem.findMany({
      where: {
        type: { in: ['IMAGE', 'VIDEO', 'PDF'] },
        ...whereBase,
      }
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link ?? null,
      cover: item.cover ?? null,
    }));
  }

  async getShelfRow1Images(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        type: 'IMAGE',

        ...(dto.mainId && dto.department == 'LEGAL' && { legalId: dto.mainId }),
        ...(dto.subId && dto.department == 'LEGAL' && { subLegalId: dto.subId }),
        ...(dto.groupId && dto.department == 'LEGAL' && { legalGroupId: dto.groupId }),

        ...(dto.mainId && dto.department == 'PR' && { prId: dto.mainId }),
        ...(dto.subId && dto.department == 'PR' && { subPrId: dto.subId }),
        ...(dto.groupId && dto.department == 'PR' && { prGroupId: dto.groupId }),

        ...(dto.department && { department: dto.department }),
      },
      orderBy: { id: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link ?? null,
      cover: item.cover ?? null,
    }));
  }

  async getShelfRow2Videos(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        type: 'VIDEO',

        ...(dto.mainId && dto.department == 'LEGAL' && { legalId: dto.mainId }),
        ...(dto.subId && dto.department == 'LEGAL' && { subLegalId: dto.subId }),
        ...(dto.groupId && dto.department == 'LEGAL' && { legalGroupId: dto.groupId }),

        ...(dto.mainId && dto.department == 'PR' && { prId: dto.mainId }),
        ...(dto.subId && dto.department == 'PR' && { subPrId: dto.subId }),
        ...(dto.groupId && dto.department == 'PR' && { prGroupId: dto.groupId }),

        ...(dto.department && { department: dto.department }),
      },

      orderBy: { id: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link ?? null,
      src: item.file ?? null,
      cover: item.cover ?? null,
      isVideo: true,
    }));
  }

  async getShelfRow3PDFs(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        type: 'PDF',

        ...(dto.mainId && dto.department == 'LEGAL' && { legalId: dto.mainId }),
        ...(dto.subId && dto.department == 'LEGAL' && { subLegalId: dto.subId }),
        ...(dto.groupId && dto.department == 'LEGAL' && { legalGroupId: dto.groupId }),

        ...(dto.mainId && dto.department == 'PR' && { prId: dto.mainId }),
        ...(dto.subId && dto.department == 'PR' && { subPrId: dto.subId }),
        ...(dto.groupId && dto.department == 'PR' && { prGroupId: dto.groupId }),

        ...(dto.department && { department: dto.department }),
      },
      orderBy: { id: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      title: item.title,
      link: item.link ?? null,
      cover: item.cover ?? null,
      isPdf: true,
    }));
  }

  async getAllContentList(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.department && { department: dto.department }),
      },
      include: {
        legal: true,
        subLegal: { include: { legal: true } },
        legalGroup: { include: { sub: { include: { legal: true } } } },

        pr: true,
        subPr: { include: { pr: true } },
        prGroup: { include: { sub: { include: { pr: true } } } },
      },
      orderBy: { id: 'asc' },
    });

    const result: Record<string, any[]> = {};

    for (const item of items) {
      let mainKey: string | null = null;

      // =========================
      // 🔥 PRIORITY: group → sub → main
      // =========================

      if (item.legalGroup) {
        mainKey = item.legalGroup.sub.legal.id;
      }

      if (item.prGroup) {
        mainKey = item.prGroup.sub.pr.id;
      }

      if (!mainKey && item.subLegal) {
        mainKey = item.subLegal.legal.id;
      }

      if (!mainKey && item.subPr) {
        mainKey = item.subPr.pr.id;
      }

      if (!mainKey && item.legal) {
        mainKey = item.legal.id;
      }

      if (!mainKey && item.pr) {
        mainKey = item.pr.id;
      }

      if (!mainKey) continue;

      if (!result[mainKey]) result[mainKey] = [];

      let type: 'gallery' | 'vdo' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'gallery';
          break;
        case 'VIDEO':
          type = 'vdo';
          break;
        case 'PDF':
          type = 'pdf';
          break;
        default:
          continue;
      }

      result[mainKey].push({
        id: item.id,
        title: item.title,
        type,
        link: item.link,
        file: item.file ?? undefined,
        coverImage: item.cover ?? undefined,
      });
    }

    return result;
  }

  async getAllContentRegistry() {
    const items = await this.prisma.contentItem.findMany({
      include: {
        // ===== LEGAL =====
        legal: true,
        subLegal: {
          include: {
            legal: true,
          },
        },
        legalGroup: {
          include: {
            sub: {
              include: {
                legal: true,
              },
            },
          },
        },

        // ===== PR =====
        pr: true,
        subPr: {
          include: {
            pr: true,
          },
        },
        prGroup: {
          include: {
            sub: {
              include: {
                pr: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    type ContentItemDto = {
      id: string;
      title: string;
      link?: string | null;
      src?: string;
      cover?: string;
      isPdf?: boolean;
      isVideo?: boolean;
    };

    type ContentGroup = {
      images: ContentItemDto[];
      videos: ContentItemDto[];
      pdfs: ContentItemDto[];
    };

    return items.reduce<Record<string, ContentGroup>>((acc, item) => {
      let key: string | null = null;

      // =========================
      // 🔥 PRIORITY: group → sub → main
      // =========================

      // GROUP
      if (item.legalGroup) {
        key = item.legalGroup.sub.legal.id;
      }
      if (item.prGroup) {
        key = item.prGroup.sub.pr.id;
      }

      // SUB
      if (!key && item.subLegal) {
        key = item.subLegal.legal.id;
      }
      if (!key && item.subPr) {
        key = item.subPr.pr.id;
      }

      // MAIN
      if (!key && item.legal) {
        key = item.legal.id;
      }
      if (!key && item.pr) {
        key = item.pr.id;
      }

      if (!key) return acc;

      const typeKey = this.mapTypeArray(item.type); // images | videos | pdfs

      // init group
      if (!acc[key]) {
        acc[key] = {
          images: [],
          videos: [],
          pdfs: [],
        };
      }

      // =========================
      // 🔥 map field
      // =========================
      let cover: string | undefined;
      let src: string | undefined;

      if (typeKey === 'images') {
        cover = item.cover ?? undefined;
      } else {
        src = item.file ?? undefined;
      }

      const data: ContentItemDto = {
        id: item.id,
        title: item.title,
        link: item.link,
        src,
        cover,
        isPdf: item.type === 'PDF' ? true : undefined,
        isVideo: item.type === 'VIDEO' ? true : undefined,
      };

      acc[key][typeKey].push(data);

      return acc;
    }, {});
  }

  private mapTypeArray(type: string): 'images' | 'videos' | 'pdfs' {
    switch (type) {
      case 'IMAGE':
        return 'images';
      case 'VIDEO':
        return 'videos';
      case 'PDF':
        return 'pdfs';
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}

@Injectable()
export class MediaServiceV2 {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getAllContentList(dto: any) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.department && { department: dto.department }),
        ...(dto.mainId && dto.department === 'LEGAL' && { legalId: dto.mainId }),
        ...(dto.subId && dto.department === 'LEGAL' && { subLegalId: dto.subId }),
        ...(dto.groupId && dto.department === 'LEGAL' && { legalGroupId: dto.groupId }),

        ...(dto.mainId && dto.department === 'PR' && { prId: dto.mainId }),
        ...(dto.subId && dto.department === 'PR' && { subPrId: dto.subId }),
        ...(dto.groupId && dto.department === 'PR' && { prGroupId: dto.groupId }),
      },
      include: {
        legal: true,
        subLegal: { include: { legal: true } },
        legalGroup: { include: { sub: { include: { legal: true } } } },

        pr: true,
        subPr: { include: { pr: true } },
        prGroup: { include: { sub: { include: { pr: true } } } },
      },
      orderBy: { id: 'asc' },
    });

    const result: Record<string, any> = {};

    for (const item of items) {
      let mainId: string | null = null;
      let subId: string | null = null;
      let groupId: string | null = null;

      // =========================
      // 🔥 resolve hierarchy
      // =========================

      if (item.legalGroup) {
        groupId = item.legalGroup.id;
        subId = item.legalGroup.sub.id;
        mainId = item.legalGroup.sub.legal.id;
      }

      if (item.prGroup) {
        groupId = item.prGroup.id;
        subId = item.prGroup.sub.id;
        mainId = item.prGroup.sub.pr.id;
      }

      if (!mainId && item.subLegal) {
        subId = item.subLegal.id;
        mainId = item.subLegal.legal.id;
      }

      if (!mainId && item.subPr) {
        subId = item.subPr.id;
        mainId = item.subPr.pr.id;
      }

      if (!mainId && item.legal) {
        mainId = item.legal.id;
      }

      if (!mainId && item.pr) {
        mainId = item.pr.id;
      }

      if (!mainId) continue;

      // =========================
      // 🔥 init main
      // =========================
      if (!result[mainId]) {
        result[mainId] = { document: [] };
      }

      let target = result[mainId];

      // =========================
      // 🔥 sub layer
      // =========================
      if (subId) {
        if (!target[subId]) {
          target[subId] = { document: [] };
        }
        target = target[subId];
      }

      // =========================
      // 🔥 group layer
      // =========================
      if (groupId) {
        if (!target[groupId]) {
          target[groupId] = [];
        }
        target = target[groupId];
      }

      // =========================
      // 🔥 map type
      // =========================
      let type: 'gallery' | 'vdo' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'gallery';
          break;
        case 'VIDEO':
          type = 'vdo';
          break;
        case 'PDF':
          type = 'pdf';
          break;
        default:
          continue;
      }

      const mapped = {
        id: item.id,
        title: item.title,
        type,
        link: item.link,
        file: item.file ?? undefined,
        coverImage: item.cover ?? undefined,
      };

      // =========================
      // 🔥 push data
      // =========================
      if (Array.isArray(target)) {
        target.push(mapped);
      } else {
        target.document.push(mapped);
      }
    }

    return result;
  }

  async getContentByLayer(dto: {
    department: 'LEGAL' | 'PR';
    mainId?: string;
    subId?: string;
    groupId?: string;
  }) {
    if (!dto.mainId) {
      throw new Error('mainId is required');
    }

    const where: any = {
      ...(dto.department && { department: dto.department }),
    };

    if (dto.groupId) {
      if (dto.department === 'LEGAL') {
        where.legalGroupId = dto.groupId;
      } else {
        where.prGroupId = dto.groupId;
      }
    } else if (dto.subId) {
      if (dto.department === 'LEGAL') {
        where.subLegalId = dto.subId;
      } else {
        where.subPrId = dto.subId;
      }
    } else if (dto.mainId) {
      if (dto.department === 'LEGAL') {
        where.legalId = dto.mainId;
      } else {
        where.prId = dto.mainId;
      }
    } else {
      throw new Error('At least mainId is required');
    }

    const items = await this.prisma.contentItem.findMany({
      where,
      include: {
        legal: true,
        subLegal: { include: { legal: true } },
        legalGroup: { include: { sub: { include: { legal: true } } } },

        pr: true,
        subPr: { include: { pr: true } },
        prGroup: { include: { sub: { include: { pr: true } } } },
      },
      orderBy: { id: 'asc' },
    });

    const result = items.map((item) => {
      let type: 'gallery' | 'vdo' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'gallery';
          break;
        case 'VIDEO':
          type = 'vdo';
          break;
        case 'PDF':
          type = 'pdf';
          break;
        default:
          return null;
      }

      return {
        id: item.id,
        title: item.title,
        type,
        link: item.link,
        file: item.file ?? undefined,
        coverImage: item.cover ?? undefined,
      };
    }).filter(Boolean);

    // =========================
    // 🔥 response key
    // =========================
    let key = dto.mainId;

    if (dto.groupId) key = dto.groupId;
    else if (dto.subId) key = dto.subId;

    return {
      [key]: result,
    };
  }

  async getContentBySensitiveLayer(dto: {
    department: 'LEGAL' | 'PR';
    mainId?: string;
    subId?: string;
    groupId?: string;
  }) {
    if (!dto.mainId) {
      throw new Error('mainId is required');
    }

    const isLegal = dto.department === 'LEGAL';

    // =========================
    // 🔥 BUILD WHERE (STRICT LAYER)
    // =========================
    const where: any = {
      ...(dto.department && { department: dto.department }),
    };

    if (dto.groupId) {
      // 🎯 GROUP ONLY
      if (isLegal) {
        where.legalGroupId = dto.groupId;
      } else {
        where.prGroupId = dto.groupId;
      }

    } else if (dto.subId) {
      // 🎯 SUB ONLY
      if (isLegal) {
        where.subLegalId = dto.subId;
        where.legalGroupId = null;
      } else {
        where.subPrId = dto.subId;
        where.prGroupId = null;
      }

    } else {
      // 🎯 MAIN ONLY
      if (isLegal) {
        where.legalId = dto.mainId;
        where.subLegalId = null;
        where.legalGroupId = null;
      } else {
        where.prId = dto.mainId;
        where.subPrId = null;
        where.prGroupId = null;
      }
    }

    // =========================
    // 🔥 QUERY
    // =========================
    const items = await this.prisma.contentItem.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    // =========================
    // 🔥 MAP RESULT
    // =========================
    const result = items
      .map((item) => {
        let type: 'gallery' | 'vdo' | 'pdf';

        switch (item.type) {
          case 'IMAGE':
            type = 'gallery';
            break;
          case 'VIDEO':
            type = 'vdo';
            break;
          case 'PDF':
            type = 'pdf';
            break;
          default:
            return null;
        }

        return {
          id: item.id,
          title: item.title,
          type,
          link: item.link,
          file: item.file ?? undefined,
          coverImage: item.cover ?? undefined,
        };
      })
      .filter(Boolean);

    // =========================
    // 🔥 RESPONSE KEY
    // =========================
    let key = dto.mainId;

    if (dto.groupId) key = dto.groupId;
    else if (dto.subId) key = dto.subId;

    return {
      [key]: result,
    };
  }

  async getAllContentRegistry() {
    const items = await this.prisma.contentItem.findMany({
      include: {
        // ===== LEGAL =====
        legal: true,
        subLegal: {
          include: {
            legal: true,
          },
        },
        legalGroup: {
          include: {
            sub: {
              include: {
                legal: true,
              },
            },
          },
        },

        // ===== PR =====
        pr: true,
        subPr: {
          include: {
            pr: true,
          },
        },
        prGroup: {
          include: {
            sub: {
              include: {
                pr: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    type ContentItemDto = {
      id: string;
      title: string;
      link?: string | null;
      src?: string;
      cover?: string;
      isPdf?: boolean;
      isVideo?: boolean;
    };

    type ContentGroup = {
      images: ContentItemDto[];
      videos: ContentItemDto[];
      pdfs: ContentItemDto[];
    };

    return items.reduce<Record<string, ContentGroup>>((acc, item) => {
      let key: string | null = null;

      // =========================
      // 🔥 PRIORITY: group → sub → main
      // =========================

      // GROUP
      if (item.legalGroup) {
        key = item.legalGroup.sub.legal.id;
      }
      if (item.prGroup) {
        key = item.prGroup.sub.pr.id;
      }

      // SUB
      if (!key && item.subLegal) {
        key = item.subLegal.legal.id;
      }
      if (!key && item.subPr) {
        key = item.subPr.pr.id;
      }

      // MAIN
      if (!key && item.legal) {
        key = item.legal.id;
      }
      if (!key && item.pr) {
        key = item.pr.id;
      }

      if (!key) return acc;

      const typeKey = this.mapTypeArray(item.type); // images | videos | pdfs

      // init group
      if (!acc[key]) {
        acc[key] = {
          images: [],
          videos: [],
          pdfs: [],
        };
      }

      // =========================
      // 🔥 map field
      // =========================
      let cover: string | undefined;
      let src: string | undefined;

      if (typeKey === 'images') {
        cover = item.cover ?? undefined;
      } else {
        src = item.file ?? undefined;
      }

      const data: ContentItemDto = {
        id: item.id,
        title: item.title,
        link: item.link,
        src,
        cover,
        isPdf: item.type === 'PDF' ? true : undefined,
        isVideo: item.type === 'VIDEO' ? true : undefined,
      };

      acc[key][typeKey].push(data);

      return acc;
    }, {});
  }

  private mapTypeArray(type: string): 'images' | 'videos' | 'pdfs' {
    switch (type) {
      case 'IMAGE':
        return 'images';
      case 'VIDEO':
        return 'videos';
      case 'PDF':
        return 'pdfs';
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  }
}
