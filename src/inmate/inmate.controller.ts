import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InmateService } from './inmate.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Inmate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'inmate',
  version: '1',
})
export class InmateController {
  constructor(private service: InmateService) {}

  @Get("profile")
  @ApiOperation({ summary: 'Get all inmate profiles' })
  @ApiResponse({
    status: 200,
    description: 'Inmate profiles retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate profiles retrieved successfully',
        data: {}
      },
    },
  })
  async getAllInmateProfiles(@Req() req) {
    const result = await this.service.getAllInmateProfiles();
    return {
      statusCode: 200,
      message: 'Inmate profiles retrieved successfully',
      data: result
    };
  }

  @Get("profile/:id")
  @ApiOperation({ summary: 'Get inmate profile by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inmate profile retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate profile retrieved successfully',
        data: {}
      },
    },
  })
  async getInmateProfileById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateProfileById(id);
    return {
      statusCode: 200,
      message: 'Inmate profile retrieved successfully',
      data: result
    };
  }

  @Get("detail")
  @ApiOperation({ summary: 'Get all inmate details' })
  @ApiResponse({
    status: 200,
    description: 'Inmate details retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate details retrieved successfully',
        data: {}
      },
    },
  })
  async getAllInmateDetails(@Req() req) {
    const result = await this.service.getAllInmateDetails();
    return {
      statusCode: 200,
      message: 'Inmate details retrieved successfully',
      data: result
    };
  }

  @Get("detail/:id")
  @ApiOperation({ summary: 'Get inmate detail by ID' })
  @ApiResponse({
    status: 200,
    description: 'Inmate detail retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate detail retrieved successfully',
        data: {}
      },
    },
  })
  async getInmateDetailById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateDetailById(id);
    return {
      statusCode: 200,
      message: 'Inmate detail retrieved successfully',
      data: result
    };
  }
}

@ApiTags('Inmate for Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'inmate/admin',
  version: '1',
})
export class AdminInmateController {
  constructor(private service: InmateService) {}

  @Get("profile")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all inmate profiles for admin' })
  @ApiResponse({
    status: 200,
    description: 'Inmate profiles retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate profiles retrieved successfully',
        data: {}
      },
    },
  })
  async getAllInmateProfiles(@Req() req) {
    const result = await this.service.getAllInmateProfiles();
    return {
      statusCode: 200,
      message: 'Inmate profiles retrieved successfully',
      data: result
    };
  }

  @Get("profile/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get inmate profile by ID for admin' })
  @ApiResponse({
    status: 200,
    description: 'Inmate profile retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate profile retrieved successfully',
        data: {}
      },
    },
  })
  async getInmateProfileById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateProfileById(id);
    return {
      statusCode: 200,
      message: 'Inmate profile retrieved successfully',
      data: result
    };
  }

  @Get("detail")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all inmate details for admin' })
  @ApiResponse({
    status: 200,
    description: 'Inmate details retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate details retrieved successfully',
        data: {}
      },
    },
  })
  async getAllInmateDetails(@Req() req) {
    const result = await this.service.getAllInmateDetails();
    return {
      statusCode: 200,
      message: 'Inmate details retrieved successfully',
      data: result
    };
  }

  @Get("detail/:id")
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get inmate detail by ID for admin' })
  @ApiResponse({
    status: 200,
    description: 'Inmate detail retrieved successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Inmate detail retrieved successfully',
        data: {}
      },
    },
  })
  async getInmateDetailById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateDetailById(id);
    return {
      statusCode: 200,
      message: 'Inmate detail retrieved successfully',
      data: result
    };
  }
}
