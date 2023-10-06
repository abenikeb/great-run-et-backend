import { IsNotEmpty, Length, IsEmail, IsEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @Length(2, 15)
  user_name: string;

  @Length(6, 15)
  @IsEmpty()
  tel: string;

  @Length(5, 250)
  @IsEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEmpty()
  forgot_password: string;

  @IsEmpty()
  isActive: boolean;

  @IsEmpty()
  salt: string;

  @IsEmpty()
  verified: boolean;

  @IsEmpty()
  gender: string;

  @IsEmpty()
  otp: string;

  @IsEmpty()
  payment_id: number;

  @IsEmpty()
  otp_expiry: Date;

  @IsEmpty()
  address: string;

  @IsEmpty()
  city: string;

  @IsEmpty()
  lat: number;

  @IsEmpty()
  lng: number;

  @IsEmpty()
  role: number;

  @IsEmpty()
  created_at: number;

  @IsEmpty()
  modified_at: number;

  @IsEmpty()
  rating: number;
}
