import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsString()
  lastName: string;

  @IsString()
  ageGroup: string;

  @IsString()
  ownerTel: string;

  @IsOptional()
  @IsString()
  tel: string;

  @IsString()
  code: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsString()
  size: string;

  @IsString()
  station: string;

  @IsOptional()
  @IsString()
  remarks: string;

  @IsNumber()
  price: string;

  @IsNumber()
  self: number;

  @IsNumber()
  other: number;

  @IsDate()
  createdDate: Date;

  @IsBoolean()
  isSelf: boolean;
}
