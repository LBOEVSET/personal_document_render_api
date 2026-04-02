import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MediaSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  department!: Department;

  @IsOptional()
  @IsString()
  mainId?: string;

  @IsOptional()
  @IsString()
  subId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;
}

export class AllContentListDto {
  @IsNotEmpty()
  @IsString()
  department!: Department;
}

export enum Department {
  INMATE = "INMATE",
  LEGAL = "LEGAL",
  PR = "PR",
}
