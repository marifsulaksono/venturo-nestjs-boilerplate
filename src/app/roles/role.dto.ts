import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
   @IsNotEmpty()
   @IsString()
   name: string

   @IsNotEmpty()
   @IsString()
   access: string
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}