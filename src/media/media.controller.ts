import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MediaService, MediaServiceV2 } from './media.service';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { AllContentListDto, MediaSubCategoryDto } from './dto/media.dto';

@ApiTags('Media')
@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private service: MediaService) {}

  @Get("infoGraphics")
  @ApiOperation({ summary: 'Get all info graphics' })
  @ApiResponse({
    status: 200,
    description: 'Info Graphics retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Info Graphics retrieved successfully',
        data: {}
      },
    },
  })
  async getAllInfoGraphics(@Req() req) {
    const result = await this.service.getAllInfoGraphics();
    return {
      statusCode: 200,
      message: 'Info Graphics retrieved successfully',
      data: result
    };
  }

  @Get("legalContentItems")
  @ApiOperation({ summary: 'Get all legal content items' })
  @ApiResponse({
    status: 200,
    description: 'Legal Content Items retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Content Items retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalContentItems(@Req() req) {
    const result = await this.service.getLegalContentItems();
    return {
      statusCode: 200,
      message: 'Legal Content Items retrieved successfully',
      data: result
    };
  }

  @Get("getStandardShelfItems")
  @ApiOperation({ summary: 'Get Standard Shelf Items' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Standard Shelf Items',
    schema: {
      example: {
        statusCode: 201,
        message: 'Standard Shelf Items retrieved successfully',
        data: {}
      },
    },
  })
  async getStandardShelfItems(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getStandardShelfItems(query);
    return {
      statusCode: 200,
      message: 'Standard Shelf Items retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow1Images")
  @ApiOperation({ summary: 'Get Shelf Row 1 Images' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Shelf Row 1 Images',
    schema: {
      example: {
        statusCode: 201,
        message: 'Shelf Row 1 Images retrieved successfully',
        data: {}
      },
    },
  })
  async getShelfRow1Images(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getShelfRow1Images(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 1 Images retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow2Videos")
  @ApiOperation({ summary: 'Get Shelf Row 2 Videos' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Shelf Row 2 Videos',
    schema: {
      example: {
        statusCode: 201,
        message: 'Shelf Row 2 Videos retrieved successfully',
        data: {}
      },
    },
  })
  async getShelfRow2Videos(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getShelfRow2Videos(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 2 Videos retrieved successfully',
      data: result
    };
  }

  @Get("shelfRow3PDFs")
  @ApiOperation({ summary: 'Get Shelf Row 3 PDFs' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Shelf Row 3 PDFs',
    schema: {
      example: {
        statusCode: 201,
        message: 'Shelf Row 3 PDFs retrieved successfully',
        data: {}
      },
    },
  })
  async getShelfRow3PDFs(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getShelfRow3PDFs(query);
    return {
      statusCode: 200,
      message: 'Shelf Row 3 PDFs retrieved successfully',
      data: result
    };
  }

  @Get("contentList")
  @ApiOperation({ summary: 'Get All Content List' })
  @ApiQuery({ type: AllContentListDto })
  @ApiResponse({
    status: 201,
    description: 'Get All Content List',
    schema: {
      example: {
        statusCode: 201,
        message: 'All Content List retrieved successfully',
        data: {}
      },
    },
  })
  async getAllContentList(@Req() req, @Query() query: AllContentListDto) {
    const result = await this.service.getAllContentList(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("contentRegistry")
  @ApiOperation({ summary: 'Get All Content Registry' })
  @ApiResponse({
    status: 201,
    description: 'Get All Content Registry',
    schema: {
      example: {
        statusCode: 201,
        message: 'All Content Registry retrieved successfully',
        data: {}
      },
    },
  })
  async getAllContentRegistry(@Req() req) {
    const result = await this.service.getAllContentRegistry();
    return {
      statusCode: 200,
      message: 'All Content Registry retrieved successfully',
      data: result
    };
  }
}

@ApiTags('MediaV2')
@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'media',
  version: '2',
})
export class MediaControllerV2 {
  constructor(private service: MediaServiceV2) {}

  @Get("contentList")
  @ApiOperation({ summary: 'Get Content List' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Content List',
    schema: {
      example: {
        statusCode: 201,
        message: 'Content List retrieved successfully',
        data: {}
      },
    },
  })
  async getAllContentList(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getAllContentList(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("contentListByLayer")
  @ApiOperation({ summary: 'Get Content List By Layer' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Content List By Layer',
    schema: {
      example: {
        statusCode: 201,
        message: 'Content List retrieved successfully',
        data: {}
      },
    },
  })
  async getContentByLayer(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getContentByLayer(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }

  @Get("getContentBySensitiveLayer")
  @ApiOperation({ summary: 'Get Content By Sensitive Layer' })
  @ApiQuery({ type: MediaSubCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Get Content By Sensitive Layer',
    schema: {
      example: {
        statusCode: 201,
        message: 'Content List retrieved successfully',
        data: {}
      },
    },
  })
  async getContentBySensitiveLayer(@Req() req, @Query() query: MediaSubCategoryDto) {
    const result = await this.service.getContentBySensitiveLayer(query);
    return {
      statusCode: 200,
      message: 'Content List retrieved successfully',
      data: result
    };
  }
}

