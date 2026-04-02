import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MenuService, MenuServiceV2 } from './menu.service';
import { Public } from 'src/common/decorators/public.decorator';
import { AllGroupCategoriesDto, SubCategoriesDto, AllSubCategoriesDto } from './dto/menu.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Menu')
@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'menu',
  version: '1',
})
export class MenuController {
  constructor(private service: MenuServiceV2) {}

  @Get("mainMenu")
  @ApiOperation({ summary: 'Get Main Menu' })
  @ApiResponse({
    status: 200,
    description: 'Get Main Menu',
    schema: {
      example: {
        statusCode: 200,
        message: 'Main Menu retrieved successfully',
        data: {}
      },
    },
  })
  async getMainMenu(@Req() req) {
    const result = await this.service.getMainMenu();
    return {
      statusCode: 200,
      message: 'Main Menu retrieved successfully',
      data: result
    };
  }

  @Get("legalCategories")
  @ApiOperation({ summary: 'Get Legal Categories' })
  @ApiResponse({
    status: 200,
    description: 'Get Legal Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalCategories(@Req() req) {
    const result = await this.service.getAllLegalCategories();
    return {
      statusCode: 200,
      message: 'Legal Categories retrieved successfully',
      data: result
    };
  }

  @Get("prDepartments")
  @ApiOperation({ summary: 'Get PR Departments' })
  @ApiResponse({
    status: 200,
    description: 'Get PR Departments',
    schema: {
      example: {
        statusCode: 200,
        message: 'PR Departments retrieved successfully',
        data: {}
      },
    },
  })
  async getAllPrDepartments(@Req() req) {
    const result = await this.service.getAllPrDepartments();
    return {
      statusCode: 200,
      message: 'PR Departments retrieved successfully',
      data: result
    };
  }
}
