import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MediaService, MediaServiceV2 } from './media.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private service: MediaService) {}

  @Get("infoGraphics")
  async getAllInfoGraphics(@Req() req) {
    const result = await this.service.getAllInfoGraphics();
    return {
      statusCode: 200,
      message: 'Info Graphics retrieved successfully',
      data: result
    };
  }

  @Get("legalContentItems")
  async getAllLegalContentItems(@Req() req, @Query() query) {
    const result = await this.service.getLegalContentItems(query);
    return {
      statusCode: 200,
      message: 'Legal Content Items retrieved successfully',
      data: result
    };
  }

  @Get("getStandardShelfItems")
  async getStandardShelfItems(@Req() req, @Query() query) {
    const result = await this.service.getStandardShelfItems(query);
    return {
      statusCode: 200,
      message: 'Standard Shelf Items retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow1Images")
  async getShelfRow1Images(@Req() req, @Query() query) {
    const result = await this.service.getShelfRow1Images(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 1 Images retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow2Videos")
  async getShelfRow2Videos(@Req() req, @Query() query) {
    const result = await this.service.getShelfRow2Videos(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 2 Videos retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow3PDFs")
  async getShelfRow3PDFs(@Req() req, @Query() query) {
    const result = await this.service.getShelfRow3PDFs(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 3 PDFs retrieved successfully',
      data: result
    };
  }

  @Get("contentList")
  async getAllContentList(@Req() req, @Query() query) {
    const result = await this.service.getAllContentList(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("contentRegistry")
  async getAllContentRegistry(@Req() req) {
    const result = await this.service.getAllContentRegistry();
    return {
      statusCode: 200,
      message: 'Content Registry retrieved successfully',
      data: result
    };
  }
}

@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'media',
  version: '2',
})
export class MediaControllerV2 {
  constructor(private service: MediaServiceV2) {}

  @Get("contentList")
  async getAllContentList(@Req() req, @Query() query) {
    const result = await this.service.getAllContentList(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("contentListByLayer")
  async getContentByLayer(@Req() req, @Query() query) {
    const result = await this.service.getContentByLayer(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("getContentBySensitiveLayer")
  async getContentBySensitiveLayer(@Req() req, @Query() query) {
    const result = await this.service.getContentBySensitiveLayer(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("contentRegistry")
  async getAllContentRegistry(@Req() req) {
    const result = await this.service.getAllContentRegistry();
    return {
      statusCode: 200,
      message: 'Content Registry retrieved successfully',
      data: result
    };
  }
}

