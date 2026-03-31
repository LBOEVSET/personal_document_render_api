import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MenuService, MenuServiceV2 } from './menu.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'menu',
  version: '1',
})
export class MenuController {
  constructor(private service: MenuService) {}

  @Get("mainMenu")
  async getMainMenu(@Req() req) {
    const result = await this.service.getMainMenu();
    return {
      statusCode: 200,
      message: 'Main Menu retrieved successfully',
      data: result
    };
  }

  @Get("legalCategories")
  async getAllLegalCategories(@Req() req) {
    const result = await this.service.getAllLegalCategories();
    return {
      statusCode: 200,
      message: 'Legal Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalSubItem")
  async getAllLegalSubCategories(@Req() req, @Query() query) {
    const result = await this.service.getAllLegalSubCategoriesItem(query);
    return {
      statusCode: 200,
      message: 'Legal Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalGroupItem")
  async getAllLegalGroupItems(@Req() req, @Query() query) {
    const result = await this.service.getAllLegalGroupCategoriesItem(query);
    return {
      statusCode: 200,
      message: 'Legal Group Categories retrieved successfully',
      data: result
    };
  }

  @Get("prDepartments")
  async getAllPrDepartments(@Req() req) {
    const result = await this.service.getAllPrDepartments();
    return {
      statusCode: 200,
      message: 'PR Departments retrieved successfully',
      data: result
    };
  }

  @Get("prSubItem")
  async getAllPrSubItem(@Req() req, @Query() query) {
    const result = await this.service.getAllPrSubItem(query);
    return {
      statusCode: 200,
      message: 'PR Sub Items retrieved successfully',
      data: result
    };
  }

  @Get("prGroupItem")
  async getAllPrGroupItems(@Req() req, @Query() query) {
    const result = await this.service.getAllPrGroupItems(query);
    return {
      statusCode: 200,
      message: 'PR Group Menus retrieved successfully',
      data: result
    };
  }
}

@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'menu',
  version: '2',
})
export class MenuControllerV2 {
  constructor(private service: MenuServiceV2) {}

  @Get("mainMenu")
  async getMainMenu(@Req() req) {
    const result = await this.service.getMainMenu();
    return {
      statusCode: 200,
      message: 'Main Menu retrieved successfully',
      data: result
    };
  }

  @Get("legalCategories")
  async getAllLegalCategories(@Req() req) {
    const result = await this.service.getAllLegalCategories();
    return {
      statusCode: 200,
      message: 'Legal Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalSubCategories")
  async getAllLegalSubCategories(@Req() req, @Query() query) {
    const result = await this.service.getAllLegalSubCategories(query);
    return {
      statusCode: 200,
      message: 'Legal Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalGroupCategories")
  async getAllLegalGroupCategories(@Req() req, @Query() query) {
    const result = await this.service.getAllLegalGroupCategories(query);
    return {
      statusCode: 200,
      message: 'Legal Group Categories retrieved successfully',
      data: result
    };
  }

  @Get("prDepartments")
  async getAllPrDepartments(@Req() req) {
    const result = await this.service.getAllPrDepartments();
    return {
      statusCode: 200,
      message: 'PR Departments retrieved successfully',
      data: result
    };
  }

  @Get("prSubCategories")
  async getAllPrSubCategories(@Req() req, @Query() query) {
    const result = await this.service.getAllPrSubCategories(query);
    return {
      statusCode: 200,
      message: 'PR Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("prGroupCategories")
  async getAllPrGroupCategories(@Req() req, @Query() query) {
    const result = await this.service.getAllPrGroupCategories(query);
    return {
      statusCode: 200,
      message: 'PR Group Categories retrieved successfully',
      data: result
    };
  }
}
