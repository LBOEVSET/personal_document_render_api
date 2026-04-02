import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'My Document' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'IMAGE', enum: ['IMAGE', 'VIDEO', 'PDF'] })
  @IsNotEmpty()
  @IsEnum(['IMAGE', 'VIDEO', 'PDF'])
  type: 'IMAGE' | 'VIDEO' | 'PDF';
  
  @ApiProperty({ example: 'LEGAL', enum: ['LEGAL', 'PR'] })
  @IsNotEmpty()
  @IsEnum(['LEGAL', 'PR'])
  department: 'LEGAL' | 'PR';

  @ApiProperty({ example: '7-main', required: false })
  @IsOptional()
  @IsString()
  mainId?: string;

  @ApiProperty({ example: '9-sub', required: false })
  @IsOptional()
  @IsString()
  subId?: string;

  @ApiProperty({ example: '3-group', required: false })
  @IsOptional()
  @IsString()
  groupId?: string;

  @ApiProperty({ example: '7-main/9-sub/3-group/file.pdf', required: false })
  @IsOptional()
  @IsString()
  file?: string;
}
