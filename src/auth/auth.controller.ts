import { Controller, Post, Put, Delete, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Log } from 'mongodb';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterInmateDto, RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RolesGuard } from 'src/common/guards/roles.guard';


@UseGuards(JwtAuthGuard)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RolesGuard)
  @Post('register/inmate')
  async registerInmate(
    @Body() body: RegisterInmateDto,
  ) {
    const userDto = {
      username: body.id,
      password: body.password,
      name: body.name,
      profileImage: body.profileImage,
      role: 'INMATE',
    };
    const userData = await this.authService.registerInmate(userDto);

    const dto = {
      ...body,
      userId: userData.id,
      secret: undefined
    }

    const inmateData = await this.authService.createInmateData(dto);
    
    return {
      statusCode: 201,
      message: 'Inmate registered successfully',
      data: { ...userData, inmateData }
    };
  }

  @UseGuards(RolesGuard)
  @Public()
  @Post('register/admin')
  async registerAdmin(@Body() body: RegisterDto) {
    const result = await this.authService.registerAdmin(body);

    return {
      statusCode: 201,
      message: 'Admin registered successfully',
      data: result
    };
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    return {
      statusCode: 200,
      message: 'Login successful',
      data: result
    };
  }

  @Public()
  @Put('refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    const result = await this.authService.refresh(body);

    return {
      statusCode: 200,
      message: 'Token refreshed successfully',
      data: result
    };
  }

  @Public()
  @Delete('logout')
  async logout(@Body() body: RefreshTokenDto) {
    const result = await this.authService.logout(body); 

    return {
      statusCode: 200,
      message: 'Logout successful',
      data: result
    };
  }

}
