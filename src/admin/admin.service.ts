import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateContentDto } from './dto/admin.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createContent(dto: CreateContentDto) {
    const where = {
      ...(dto.mainId && dto.department === 'LEGAL' && { legalId: dto.mainId }),

      ...(dto.mainId && dto.department === 'PR' && { prId: dto.mainId }),

      ...(dto.department && { department: dto.department }),
    };

    const latestItem = await this.prisma.contentItem.findFirst({
      where: {
        type: dto.type,
        ...where,
      },
      orderBy: { id: 'desc' },
    });

    const newId = this.generateNextId(
      latestItem?.id ?? null,
      dto.type,
    );

    const { link, cover } = this.buildPath({
      ...dto,
      id: newId,
    });

    const relations = this.mapRelations(dto);

    return this.prisma.contentItem.create({
      data: {
        //id: newId,
        title: dto.title,
        type: dto.type,
        department: dto.department,

        file: dto.file ?? null,
        link,
        cover: cover ?? null,

        ...relations,
      },
    });
  }

  async createManyContents(dtos: CreateContentDto[]) {
    if (!dtos.length) return;

    const sample = dtos[0];

    const where = {
      ...(sample.mainId && sample.department === 'LEGAL' && { legalId: sample.mainId }),

      ...(sample.mainId && sample.department === 'PR' && { prId: sample.mainId }),

      ...(sample.department && { department: sample.department }),
    };

    // หา latest แค่ครั้งเดียว
    const latestItem = await this.prisma.contentItem.findFirst({
      where: {
        type: sample.type,
        ...where,
      },
      orderBy: { id: 'desc' },
    });

    // extract number ตั้งต้น
    const prefixMap = {
      IMAGE: 'img',
      VIDEO: 'v',
      PDF: 'pdf',
    };

    const prefix = prefixMap[sample.type];

    let startNumber = 0;

    if (latestItem?.id) {
      const match = latestItem.id.match(/\d+$/);
      startNumber = match ? parseInt(match[0], 10) : 0;
    }

    // generate id ต่อเนื่อง
    const data = dtos.map((dto, index) => {
      const newId = `${prefix}-${startNumber + index + 1}`;

      const { link, cover } = this.buildPath({
        ...dto,
        id: newId,
      });

      const relations = this.mapRelations(dto);

      return {
        id: newId,
        title: dto.title,
        type: dto.type,
        department: dto.department,

        file: dto.file ?? null,
        link,
        cover: cover ?? null,

        ...relations,
      };
    });

    return this.prisma.contentItem.createMany({
      data,
      skipDuplicates: true,
    });
  }

  private buildPath(dto: any) {
    const base = dto.department === 'LEGAL' ? 'legal' : 'pr';

    const segments = [base];

    if (dto.mainId) segments.push(dto.mainId);

    if (!dto.file) {
      throw new BadRequestException('File is required (upload first)');
    }

    let link = '';
    let cover: string | null = null;

    switch (dto.type) {
      case 'IMAGE':
        link = dto.file; // ใช้ path ตรงๆ
        cover = dto.file;
        break;

      case 'PDF':
        link = dto.file;
        cover = `/default/pdf_default.png`;
        break;

      case 'VIDEO':
        link = dto.file;
        cover = `/default/video_default.jpeg`;
        break;
    }

    return {
      link,
      cover,
    };
  }

  private mapRelations(dto: CreateContentDto) {
    if (dto.department === 'LEGAL') {
      return {
        legalId: dto.mainId ?? null,

        prId: null,
      };
    }

    return {
      prId: dto.mainId ?? null,

      legalId: null,
    };
  }

  private generateNextId(latestId: string | null, type: 'IMAGE' | 'VIDEO' | 'PDF') {
    const prefixMap = {
      IMAGE: 'img',
      VIDEO: 'v',
      PDF: 'pdf',
    };

    const prefix = prefixMap[type];

    if (!latestId) {
      return `${prefix}-1`;
    }

    // extract number จาก id เช่น v12 → 12
    const match = latestId.match(/\d+$/);
    const lastNumber = match ? parseInt(match[0], 10) : 0;

    const nextNumber = lastNumber + 1;

    return `${prefix}-${nextNumber}`;
  }

  async deleteContent(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const item = await tx.contentItem.findUnique({
        where: { id },
      });

      if (!item) {
        throw new BadRequestException('Document not found');
      }

      // 🔥 ลบไฟล์จริง (ถ้ามี)
      if (item.file) {
        const filePath = `./uploads${item.file}`;

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      // 🔥 ลบ record
      await tx.contentItem.delete({
        where: { id },
      });

      return true;
    });
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

          // ✅ update profileImage ผ่าน user (ถ้ามี)
          ...(dto.userId && dto.profileImage && {
            user: {
              update: {
                profileImage: dto.profileImage,
              },
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
          user: true,
        },
      });
    });
  }
}

@Injectable()
export class AdminUploadService {
  getConfig(folder: string = 'content') {
    return {
      storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|pdf|mp4)$/)) {
          return cb(new Error('Only image/pdf/video allowed'), false);
        }
        cb(null, true);
      },
    };
  }

  getProfileImageConfig() {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dto = req.query;
          const userType = dto.userType ?? 'default';

          const folder = `./uploads/${userType}`;

          fs.mkdirSync(folder, { recursive: true });

          cb(null, folder);
        },
        filename: (req, file, cb) => {
          const uniqueName =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          cb(null, `${uniqueName}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Only jpg/png files allowed'), false);
        }
        cb(null, true);
      },
    };
  }

  dynamicStorage() {
    return diskStorage({
      destination: (req, file, cb) => {
        const dto = req.query;

        const base = dto.department === 'LEGAL' ? 'legal' : 'pr';

        const segments = [base];

        if (dto.mainId) segments.push(String(dto.mainId));

        const folder = `./uploads/${segments.join('/')}`;

        fs.mkdirSync(folder, { recursive: true });

        cb(null, folder);
      },

      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);

        cb(null, `${uniqueName}${extname(file.originalname)}`);
      },
    });
  }
}
