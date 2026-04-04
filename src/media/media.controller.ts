import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { Public } from 'src/common/decorators/public.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { MediaSubCategoryDto } from './dto/media.dto';

@ApiTags('Media')
@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'media',
  version: '1',
})
export class MediaController {
  constructor(private service: MediaService) {}

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
}

