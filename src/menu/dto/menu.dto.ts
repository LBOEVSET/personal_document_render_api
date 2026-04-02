import { IsNotEmpty, IsString } from "class-validator";

export class SubCategoriesDto {
  @IsNotEmpty()
  @IsString()
  mainId!: string;
}

export class AllSubCategoriesDto {
  @IsNotEmpty()
  @IsString()
  department!: Department;

  @IsNotEmpty()
  @IsString()
  mainId!: string;
}

export class AllGroupCategoriesDto {
  @IsNotEmpty()
  @IsString()
  department: Department;

  @IsNotEmpty()
  @IsString()
  mainId!: string;
}

export enum Department {
  INMATE = "INMATE",
  LEGAL = "LEGAL",
  PR = "PR",
}
