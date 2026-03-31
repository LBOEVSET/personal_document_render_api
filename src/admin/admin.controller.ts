import { Controller, Body, Post, UseGuards, UseInterceptors, UploadedFile  } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminService, AdminUploadService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateContentDto } from './dto/admin.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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
  create(@Body() dto: CreateContentDto) {
    return this.service.createContent(dto);
  }

  @Post('add/multiple')
  createMany(@Body() dtos: CreateContentDto[]) {
    return this.service.createManyContents(dtos);
  }

  @Post('upload/profileImage')
  @UseInterceptors(
    FileInterceptor('file', new AdminUploadService().getProfileImageConfig()),
  )
  async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }

    const url = `/uploads/inmate/${file.filename}`;

    return {
      statusCode: 201,
      message: 'Upload success',
      data: {
        url,
      },
    };
  }

  @Post('upload/document')
  @UseInterceptors(FileInterceptor('file', {
    storage: new AdminUploadService().dynamicStorage(),
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new Error('File required');
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'application/pdf',
    ];

    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      throw new Error('Only image/video/pdf allowed');
    }

    const cleanPath = file.path.replace('uploads', '');

    return {
      statusCode: 201,
      data: {
        url: cleanPath.replace(/\\/g, '/'),
      },
    };
  }

}
