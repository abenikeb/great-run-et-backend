import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthLoginDto } from './create-auth-login.dto';

export class UpdateAuthLoginDto extends PartialType(CreateAuthLoginDto) {}
