import { Body, Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { InmateService } from './inmate.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller({
  path: 'inmate',
  version: '1',
})
export class InmateController {
  constructor(private service: InmateService) {}

  @Get("profile")
  async getAllInmateProfiles(@Req() req) {
    const result = await this.service.getAllInmateProfiles();
    return {
      statusCode: 200,
      message: 'Inmate profiles retrieved successfully',
      data: result
    };
  }

  @Get("profile/:id")
  async getInmateProfileById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateProfileById(id);
    return {
      statusCode: 200,
      message: 'Inmate profile retrieved successfully',
      data: result
    };
  }

  @Get("detail")
  async getAllInmateDetails(@Req() req) {
    const result = await this.service.getAllInmateDetails();
    return {
      statusCode: 200,
      message: 'Inmate details retrieved successfully',
      data: result
    };
  }

  @Get("detail/:id")
  async getInmateDetailById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateDetailById(id);
    return {
      statusCode: 200,
      message: 'Inmate detail retrieved successfully',
      data: result
    };
  }
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'inmate/admin',
  version: '1',
})
export class AdminInmateController {
  constructor(private service: InmateService) {}

  @Get("profile")
  @Roles(UserRole.ADMIN)
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
  async getInmateDetailById(@Param('id') id: string, @Req() req) {
    const result = await this.service.getInmateDetailById(id);
    return {
      statusCode: 200,
      message: 'Inmate detail retrieved successfully',
      data: result
    };
  }
}
