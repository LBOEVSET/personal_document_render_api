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
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'inmate',
  version: '1',
})
export class InmateController {
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
    const result = await this.service.getInmateProfileById(id, req.user);
    return {
      statusCode: 200,
      message: 'Inmate profile retrieved successfully',
      data: result
    };
  }
}
