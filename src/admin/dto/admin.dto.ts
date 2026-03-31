import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsEnum(['IMAGE', 'VIDEO', 'PDF'])
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  
  @IsNotEmpty()
  @IsEnum(['LEGAL', 'PR'])
  department: 'LEGAL' | 'PR';

  @IsOptional()
  @IsString()
  mainId?: string;

  @IsOptional()
  @IsString()
  subId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  file?: string;
}
