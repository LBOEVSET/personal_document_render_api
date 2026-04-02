import { Controller, Post, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LogOutDto, RefreshTokenDto } from './dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RegisterInmateDto, RegisterDto } from './dto/register.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';

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
