import { AccountRegistrationType, Errors } from "bizdo";
import { IsEmail, Length } from "class-validator";
import { IsEmailUnique } from "src/decorators/pipes/IsUnique.decorator";

export class AccountRegistrationDto implements AccountRegistrationType {
    firstName: string;
    lastName: string;

    @Length(8, 32, { message: Errors.HttpErrors.BAD_PASSWORD.toString() })
    password: string;
    
    
    @IsEmailUnique()
    @IsEmail()
    email: string;
}