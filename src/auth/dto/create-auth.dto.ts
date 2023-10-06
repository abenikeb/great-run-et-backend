import { IsString, IsInt } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
