import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSaleDto {
   @IsNotEmpty()
   @IsString()
   customer_id: string;

   @IsNotEmpty()
   @IsArray()
   details: CreateSaleDetailDto[]
}

export class CreateSaleDetailDto {
   @IsNotEmpty()
   @IsString()
   product_id: string;

   @IsNotEmpty()
   @IsString()
   product_detail_id: string;

   @IsNotEmpty()
   @IsNumber()
   total_item: number;

   @IsNotEmpty()
   @IsNumber()
   price: number;
}

export class UpdateSaleDto {
   @IsNotEmpty()
   @IsString()
   customer_id: string;

   @IsNotEmpty()
   @IsArray()
   details: UpdateSaleDetailDto[]
}

export class UpdateSaleDetailDto {
   @IsNotEmpty()
   @IsString()
   id: string;

   @IsNotEmpty()
   @IsString()
   product_id: string;

   @IsNotEmpty()
   @IsString()
   product_detail_id: string;

   @IsNotEmpty()
   @IsNumber()
   total_item: number;

   @IsNotEmpty()
   @IsNumber()
   price: number;

   @IsBoolean()
   is_added: boolean;

   @IsBoolean()
   is_updated: boolean;

   @IsBoolean()
   is_deleted: boolean;
}