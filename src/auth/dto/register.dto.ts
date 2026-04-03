import { IsNumber, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

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

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

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

  @IsNotEmpty()
  @IsString()
  transferFrom!: string;

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
