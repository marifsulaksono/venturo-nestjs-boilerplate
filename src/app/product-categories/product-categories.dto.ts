import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";
export class CreateProductCategoryDto {
   @IsNotEmpty()
   @IsString()
   name: string;
}

export class UpdateProductCategoryDto extends PartialType(CreateProductCategoryDto) {}