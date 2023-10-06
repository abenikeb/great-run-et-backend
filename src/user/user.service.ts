import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { GeneratePassword, GenerateSalt } from 'src/utility';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    public usersRepository: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto, res): Promise<Users | null> {
    const existUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existUser) return res.status(400).send('The user Alerady registered');

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(createUserDto.password, salt);

    const userData = {
      user_name: createUserDto?.user_name,
      phone: createUserDto?.phone,
      email: createUserDto?.email,
      password: userPassword,
      salt: salt,
    };

    let createdUser = this.usersRepository.create(userData);
    createdUser = await this.usersRepository.save(createdUser);

    const payload = {
      phone: createUserDto?.phone,
      email: createUserDto?.email,
      id: createdUser?.id,
    };

    const token = await this.jwtService.signAsync(payload);

    return res
      .header('Authorization', token)
      .header('access-control-expose-headers', 'Authorization')
      .json({
        userInfo: payload,
      });
  }

  async findAll(): Promise<any> {
    return this.usersRepository.find();
  }

  async findOne(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
