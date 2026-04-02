import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class MediaSubCategoryDto {
  @IsNotEmpty()
  @IsString()
  department!: Department;

  @IsOptional()
  @IsString()
  mainId?: string;
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
