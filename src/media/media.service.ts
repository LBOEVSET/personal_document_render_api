import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { AllContentListDto, MediaSubCategoryDto } from './dto/media.dto';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getAllContentList(dto: MediaSubCategoryDto) {
    const items = await this.prisma.contentItem.findMany({
      where: {
        ...(dto.department && { department: dto.department }),
        ...(dto.mainId && dto.department === 'LEGAL' && { legalId: dto.mainId }),

        ...(dto.mainId && dto.department === 'PR' && { prId: dto.mainId }),
      },
      include: {
        legal: true,

        pr: true,
      },
      orderBy: { id: 'asc' },
    });

    const result: Record<string, any> = {};

    for (const item of items) {
      let mainId: string | null = null;

      if (!mainId && item.legal) {
        mainId = item.legal.id;
      }

      if (!mainId && item.pr) {
        mainId = item.pr.id;
      }

      if (!mainId) continue;

      // =========================
      // init main
      // =========================
      if (!result[mainId]) {
        result[mainId] = { document: [] };
      }

      let target = result[mainId];

      // =========================
      // map type
      // =========================
      let type: 'image' | 'video' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'image';
          break;
        case 'VIDEO':
          type = 'video';
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
      // push data
      // =========================
      if (Array.isArray(target)) {
        target.push(mapped);
      } else {
        target.document.push(mapped);
      }
    }

    return result;
  }

  async getContentByLayer(dto: MediaSubCategoryDto) {
    if (!dto.mainId) {
      throw new BadRequestException('mainId is required');
    }

    const where: any = {
      ...(dto.department && { department: dto.department }),
    };

    if (dto.mainId) {
      if (dto.department === 'LEGAL') {
        where.legalId = dto.mainId;
      } else {
        where.prId = dto.mainId;
      }
    } else {
      throw new BadRequestException('At least mainId is required');
    }

    const items = await this.prisma.contentItem.findMany({
      where,
      include: {
        legal: true,

        pr: true,
      },
      orderBy: { id: 'asc' },
    });

    const result = items.map((item) => {
      let type: 'image' | 'video' | 'pdf';

      switch (item.type) {
        case 'IMAGE':
          type = 'image';
          break;
        case 'VIDEO':
          type = 'video';
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
    // response key
    // =========================
    let key = dto.mainId;

    return {
      [key]: result,
    };
  }
}
