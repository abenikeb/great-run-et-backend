import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';
import { ValidatePassword } from 'src/utility';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private authRepository: Repository<Users>,
    private readonly config: ConfigService,
    private usersService: UserService,
    private jwtService: JwtService, // private readonly configService: ConfigService,
  ) {}

  async signIn(email: string, pass: string, res): Promise<Users | any> {
    // console.log(this.config.get('JWT_PRIVATE_KEY'));
    const user = await this.authRepository.findOne({ where: { email: email } });
    if (!user) return res.status(400).send('Invalid user name or password');

    const validPassword = await ValidatePassword(
      pass,
      user.password,
      user.salt,
    );
    if (!validPassword) throw new UnauthorizedException();

    const payload = {
      sub: user.id,
      username: user.user_name,
      email: user.email,
    };
    res.status(200).json({
      access_token: await this.jwtService.signAsync(payload),
    });
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  findAll() {
    return `This action returns all auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
