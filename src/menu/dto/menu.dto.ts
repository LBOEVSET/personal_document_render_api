import { IsNotEmpty, IsString } from "class-validator";

export class SubCategoriesDto {
  @IsNotEmpty()
  @IsString()
  mainId!: string;
}

export class GroupCategoriesDto {
  @IsNotEmpty()
  @IsString()
  subId!: string;
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

  @IsNotEmpty()
  @IsString()
  subId!: string;
}

export enum Department {
  INMATE = "INMATE",
  LEGAL = "LEGAL",
  PR = "PR",
}
