import { Controller, Post, Put, 
  Delete, Body, UseGuards, UseInterceptors, 
  BadRequestException, UploadedFile } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginInmateDto, LogOutDto, RefreshTokenDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterInmateDto, RegisterDto, VerifyRegisterInmateUserDto } from './dto/register.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import {FileInterceptor} from '@nestjs/platform-express';

@ApiTags('Auth')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RolesGuard)
  @Post('register/inmate')
  @ApiOperation({ summary: 'Register inmate' })
  @ApiBody({ type: RegisterInmateDto })
  @ApiResponse({
    status: 201,
    description: 'Inmate registered successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Inmate registered successfully',
        data: {}
      },
    },
  })
  async registerInmate(
    @Body() body: RegisterInmateDto,
  ) {
    const userDto = {
      id: body.userId ?? '',
      username: body.username,
      password: process.env.PASSWORD || 'password_key',
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

    const inmateData = await this.authService.upsertInmateData(dto);
    
    return {
      statusCode: 201,
      message: 'Inmate registered successfully',
      data: { ...userData, inmateData }
    };
  }

  @Post('register/inmate-xlsx')
  @UseInterceptors(FileInterceptor('file'))
  async uploadInmateXlsx(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');

    return this.authService.importInmateFromXlsx(file);
  }

  @UseGuards(RolesGuard)
  @Post('pre-register/inmate')
  async preRegisterInmate(
    @Body() body: RegisterInmateDto,
  ) {
    const dto = {
      ...body,
      userId: body.userId,
      profileImage: body.profileImage,
      secret: undefined
    }

    const inmateData = await this.authService.upsertInmateData(dto);
    
    return {
      statusCode: 201,
      message: 'Inmate pre-registered successfully',
      data: { inmateData }
    };
  }

  @UseGuards(RolesGuard)
  @Post('verify-register/inmate')
  async verifyRegisterInmate(
    @Body() body: VerifyRegisterInmateUserDto,
  ) {

    const userData = await this.authService.verifyRegisterInmate(body);
    
    return {
      statusCode: 201,
      message: 'Inmate verified successfully',
      data: { ...userData }
    };
  }

  @UseGuards(RolesGuard)
  @Public()
  @Post('register/admin')
  @ApiOperation({ summary: 'Register admin' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Admin registered successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Admin registered successfully',
        data: {}
      },
    },
  })
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
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Login successful',
        data: {}
      },
    },
  })
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body);

    return {
      statusCode: 200,
      message: 'Login successful',
      data: result
    };
  }

  @Public()
  @Post('login-inmate')
  @ApiOperation({ summary: 'Login inmate' })
  @ApiBody({ type: LoginInmateDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Login successful',
        data: {}
      },
    },
  })
  async loginInmate(@Body() body: LoginInmateDto) {
    const result = await this.authService.loginInmate(body);

    return {
      statusCode: 200,
      message: 'Login successful',
      data: result
    };
  }

  @Public()
  @Put('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Token refreshed successfully',
        data: {}
      },
    },
  })
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
  @ApiOperation({ summary: 'Logout' })
  @ApiBody({ type: LogOutDto })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Logout successful',
        data: {}
      },
    },
  })
  async logout(@Body() body: LogOutDto) {
    const result = await this.authService.logout(body); 

    return {
      statusCode: 200,
      message: 'Logout successful',
      data: result
    };
  }

}
