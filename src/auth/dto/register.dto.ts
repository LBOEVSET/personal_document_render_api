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
  @IsString()
  age: string;

  @IsString()
  nationality: string;

  @IsString()
  religion: string;

  @IsString()
  holdType: string;

  @IsString()
  holdAgency: string;
}

export class RegisterInmateDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsString()
  status: string;

  @IsNumber()
  daysLeft: number;

  @IsNumber()
  totalDays: number;

  @IsNumber()
  cases: number;

  @IsString()
  caseType: string;

  @IsString()
  sentence: string;

  @IsString()
  startDate: string;

  @IsString()
  transferFrom: string;

  @IsString()
  releaseDate: string;

  @IsNumber()
  progressStep: number;

  @IsString()
  profileImage?: string;

  @IsOptional()
  detail?: CreateInmateDetailDto;

  @IsNotEmpty()
  @IsString()
  secret?: string;
}
