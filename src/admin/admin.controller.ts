import { Controller, Body, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException  } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminService, AdminUploadService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateContentDto } from './dto/admin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Public()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({
  path: 'admin',
  version: '1',
})
export class AdminController {
  constructor(
    private service: AdminService,
  ) {}

  @Post('add/document')
  @ApiOperation({ summary: 'Add document' })
  @ApiBody({ type: CreateContentDto })
  @ApiResponse({
    status: 201,
    description: 'Add document',
    schema: {
      example: {
        statusCode: 201,
        message: 'Document added successfully',
        data: {}
      },
    },
  })
  async create(@Body() dto: CreateContentDto) {
    const result = await this.service.createContent(dto);
    return {
      statusCode: 201,
      message: 'Document added successfully',
      data: result
    };
  }

  @Post('add/multiple')
  @ApiOperation({ summary: 'Add multiple documents' })
  @ApiBody({ type: [CreateContentDto] })
  @ApiResponse({
    status: 201,
    description: 'Add multiple documents',
    schema: {
      example: {
        statusCode: 201,
        message: 'Documents added successfully',
        data: {}
      },
    },
  })
  async createMany(@Body() dtos: CreateContentDto[]) {
    const result = await this.service.createManyContents(dtos);
    return {
      statusCode: 201,
      message: 'Documents added successfully',
      data: result
    };
  }

  @Post('upload/profileImage')
  @UseInterceptors(
    FileInterceptor('file', new AdminUploadService().getProfileImageConfig()),
  )
  @ApiOperation({ summary: 'Upload document (image/video/pdf)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        userType: { type: 'string', example: 'inmate' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        statusCode: 201,
        data: {
          url: '/inmate/xxx.pdf',
        },
      },
    },
  })
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const userType = body.userType || 'default';
    const url = `/uploads/${userType}/${file.filename}`;

    return {
      statusCode: 201,
      message: 'Profile image uploaded successfully',
      data: {
        url,
      },
    };
  }

  @Post('upload/document')
  @UseInterceptors(FileInterceptor('file', {
    storage: new AdminUploadService().dynamicStorage(),
  }))
  @ApiOperation({ summary: 'Upload document (image/video/pdf)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        department: { type: 'string', example: 'LEGAL' },
        mainId: { type: 'string', example: '1-main' },
        subId: { type: 'string', example: '1-sub' },
        groupId: { type: 'string', example: '1-group' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    schema: {
      example: {
        statusCode: 201,
        data: {
          url: '/legal/1-main/1-sub/1-group/xxx.pdf',
        },
      },
    },
  })
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      throw new BadRequestException('Only image/video/pdf allowed');
    }

    const cleanPath = file.path.replace('uploads', '');

    return {
      statusCode: 201,
      message: 'Document uploaded successfully',
      data: {
        url: cleanPath.replace(/\\/g, '/'),
      },
    };
  }

}
