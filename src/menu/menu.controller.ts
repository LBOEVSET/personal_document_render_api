import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MenuService, MenuServiceV2 } from './menu.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GroupCategoriesDto, AllGroupCategoriesDto, SubCategoriesDto, AllSubCategoriesDto } from './dto/menu.dto';
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
  constructor(private service: MenuService) {}

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

  @Get("legalSubItem")
  @ApiOperation({ summary: 'Get Legal Sub Categories' })
  @ApiQuery({ type: AllSubCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get Legal Sub Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Sub Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalSubCategories(@Req() req, @Query() query: AllSubCategoriesDto) {
    const result = await this.service.getAllLegalSubCategoriesItem(query);
    return {
      statusCode: 200,
      message: 'Legal Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalGroupItem")
  @ApiOperation({ summary: 'Get Legal Group Items' })
  @ApiQuery({ type: AllGroupCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get Legal Group Items',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Group Items retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalGroupItems(@Req() req, @Query() query: AllGroupCategoriesDto) {
    const result = await this.service.getAllLegalGroupCategoriesItem(query);
    return {
      statusCode: 200,
      message: 'Legal Group Items retrieved successfully',
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

  @Get("prSubItem")
  @ApiOperation({ summary: 'Get PR Sub Items' })
  @ApiQuery({ type: AllSubCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get PR Sub Items',
    schema: {
      example: {
        statusCode: 200,
        message: 'PR Sub Items retrieved successfully',
        data: {}
      },
    },
  })
  async getAllPrSubItem(@Req() req, @Query() query: AllSubCategoriesDto) {
    const result = await this.service.getAllPrSubItem(query);
    return {
      statusCode: 200,
      message: 'PR Sub Items retrieved successfully',
      data: result
    };
  }

  @Get("prGroupItem")
  @ApiOperation({ summary: 'Get PR Group Items' })
  @ApiQuery({ type: AllGroupCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get PR Group Items',
    schema: {
      example: {
        statusCode: 200,
        message: 'PR Group Items retrieved successfully',
        data: {}
      },
    },
  })
  async getAllPrGroupItems(@Req() req, @Query() query: AllGroupCategoriesDto) {
    const result = await this.service.getAllPrGroupItems(query);
    return {
      statusCode: 200,
      message: 'PR Group Items retrieved successfully',
      data: result
    };
  }
}


@ApiTags('MenuV2')
@Public()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'menu',
  version: '2',
})
export class MenuControllerV2 {
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

  @Get("legalSubCategories")
  @ApiOperation({ summary: 'Get Legal Sub Categories' })
  @ApiQuery({ type: SubCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get Legal Sub Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Sub Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalSubCategories(@Req() req, @Query() query: SubCategoriesDto) {
    const result = await this.service.getAllLegalSubCategories(query);
    return {
      statusCode: 200,
      message: 'Legal Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("legalGroupCategories")
  @ApiOperation({ summary: 'Get Legal Group Categories' })
  @ApiQuery({ type: GroupCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get Legal Group Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'Legal Group Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllLegalGroupCategories(@Req() req, @Query() query: GroupCategoriesDto) {
    const result = await this.service.getAllLegalGroupCategories(query);
    return {
      statusCode: 200,
      message: 'Legal Group Categories retrieved successfully',
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

  @Get("prSubCategories")
  @ApiOperation({ summary: 'Get PR Sub Categories' })
  @ApiQuery({ type: SubCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get PR Sub Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'PR Sub Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllPrSubCategories(@Req() req, @Query() query: SubCategoriesDto) {
    const result = await this.service.getAllPrSubCategories(query);
    return {
      statusCode: 200,
      message: 'PR Sub Categories retrieved successfully',
      data: result
    };
  }

  @Get("prGroupCategories")
  @ApiOperation({ summary: 'Get PR Group Categories' })
  @ApiQuery({ type: GroupCategoriesDto })
  @ApiResponse({
    status: 200,
    description: 'Get PR Group Categories',
    schema: {
      example: {
        statusCode: 200,
        message: 'PR Group Categories retrieved successfully',
        data: {}
      },
    },
  })
  async getAllPrGroupCategories(@Req() req, @Query() query: GroupCategoriesDto) {
    const result = await this.service.getAllPrGroupCategories(query);
    return {
      statusCode: 200,
      message: 'PR Group Categories retrieved successfully',
      data: result
    };
  }
}
