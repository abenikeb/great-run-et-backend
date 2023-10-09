import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { AuthLoginService } from './auth-login.service';
import { CreateAuthLoginDto } from './dto/create-auth-login.dto';
import { UpdateAuthLoginDto } from './dto/update-auth-login.dto';
import { Response } from 'express';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('auth-login')
export class AuthLoginController {
  constructor(private readonly authLoginService: AuthLoginService) {}

  @Public()
  @Post('apply/h5token')
  create(@Body() createAuthLoginDto: CreateAuthLoginDto, @Res() res: Response) {
    return this.authLoginService.create(createAuthLoginDto, res);
  }

  @Get()
  findAll() {
    return this.authLoginService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authLoginService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthLoginDto: UpdateAuthLoginDto,
  ) {
    return this.authLoginService.update(+id, updateAuthLoginDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authLoginService.remove(+id);
  }
}
