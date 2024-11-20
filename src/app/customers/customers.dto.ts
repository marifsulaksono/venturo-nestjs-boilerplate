import { PartialType } from "@nestjs/mapped-types";
import { IsAlphanumeric, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

const passwordRegEx =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateCustomerDto {
   @IsNotEmpty()
   @IsString()
   name: string;

   @IsNotEmpty()
   @MinLength(3, { message: 'Username must have atleast 3 characters.' })
   @IsAlphanumeric(null, {
      message: 'Username does not allow other than alpha numeric chars.',
   })
   username: string;

   @IsNotEmpty()
   @IsString()
   email: string;

   @IsNotEmpty()
   @Matches(passwordRegEx, {
      message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
   })
   password: string;

   @IsNotEmpty()
   @IsString()
   address: string;

   @IsNotEmpty()
   @IsString()
   phonenumber: string;

   photo?: string
   role_id: string
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}