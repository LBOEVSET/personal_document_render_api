import { IsNumber, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @MinLength(6)
  password?: string = process.env.PASSWORD || 'password_key';

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  secret?: string;
}

export class RegisterInmateUserDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  secret?: string;
}

export class VerifyRegisterInmateUserDto {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateInmateDetailDto {
  @IsNotEmpty()
  @IsString()
  age!: string;

  @IsNotEmpty()
  @IsString()
  nationality!: string;

  @IsNotEmpty()
  @IsString()
  religion!: string;

  @IsNotEmpty()
  @IsString()
  holdType!: string;

  @IsOptional()
  @IsString()
  holdAgency?: string;
}

export class RegisterInmateDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @MinLength(6)
  password?: string = process.env.PASSWORD || 'password_key';

  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsNotEmpty()
  @IsNumber()
  cases!: number;

  @IsNotEmpty()
  @IsString()
  caseType!: string;

  @IsNotEmpty()
  @IsString()
  sentence!: string;

  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @IsOptional()
  @IsString()
  transferFrom?: string;

  @IsNotEmpty()
  @IsString()
  releaseDate!: string;

  @IsNotEmpty()
  @IsNumber()
  progressStep!: number;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  detail?: CreateInmateDetailDto;

  @IsNotEmpty()
  @IsString()
  secret?: string;
}
