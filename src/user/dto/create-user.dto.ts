import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 15)
  user_name: string;

  @Length(6, 15)
  phone: string;

  @IsNotEmpty()
  email: string;

  @Length(5, 250)
  password: string;
}
