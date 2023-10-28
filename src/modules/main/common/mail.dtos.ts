import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class MailDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(25)
    name: string;

    @IsEmail()
    email: string;
}