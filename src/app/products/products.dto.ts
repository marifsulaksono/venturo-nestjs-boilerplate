import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @IsString()
   product_category_id: string;

   @IsNotEmpty()
   @IsNumber()
   price: number;

   @IsNotEmpty()
   @IsString()
   description: string;

   @IsNotEmpty()
   @IsBoolean()
   is_available: boolean;

   @IsNotEmpty()
   @IsArray()
   details: CreateProductDetailDto[]
}

export class CreateProductDetailDto {
   @IsNotEmpty()
   @IsString()
   type: string;

   @IsNotEmpty()
   @IsNumber()
   price: number;

   @IsNotEmpty()
   @IsString()
   description: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}