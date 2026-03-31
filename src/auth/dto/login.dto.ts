import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}

export class RefreshTokenDto {
  @IsString()
  username!: string;

  @IsString()
  refreshToken!: string;
}
