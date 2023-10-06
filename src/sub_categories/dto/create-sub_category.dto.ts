import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class CategoryDto {
  // id: number;

  @IsNotEmpty()
  parentId: number;

  @IsNotEmpty()
  name: string;

  @Length(2, 2500)
  description: string;
}
