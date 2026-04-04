import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class InmateDetailDto {
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

export class InmateProfileDto {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

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

  @IsNotEmpty()
  detail!: InmateDetailDto;
}
