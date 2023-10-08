import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  ownerName: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  ageGroup: string;

  @IsString()
  @IsNotEmpty()
  ownerTel: string;

  @IsOptional()
  @IsString()
  tel: string;

  @IsOptional()
  @IsString()
  code: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsNotEmpty()
  station: string;

  @IsOptional()
  @IsString()
  remarks: string;

  @IsString()
  @IsNotEmpty()
  price: string;

  @IsNumber()
  @IsOptional()
  self: number;

  @IsNumber()
  @IsOptional()
  other: number;

  @IsDate()
  @IsOptional()
  createdDate: Date;

  @IsBoolean()
  @IsNotEmpty()
  isSelf: boolean;

  @IsOptional()
  @IsString()
  merch_order_id: string;
}
