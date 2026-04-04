import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  password?: string = process.env.PASSWORD || 'password_key';
}

export class LoginInmateDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  password?: string = process.env.PASSWORD || 'password_key';
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  refreshToken!: string;
}

export class LogOutDto {
  @IsNotEmpty()
  @IsString()
  username!: string;
}
