import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from "bcryptjs";


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  getHashPassword = (password: string )=>{
    const salt =genSaltSync(10);
    const hash =hashSync(password, salt);
    return hash;
  }

  async create(createUserDto: CreateUserDto) {
    const hassPassword = this.getHashPassword(createUserDto.password);

    let user = await this.userModel.create({
      email:createUserDto.email,
      password:hassPassword,
      name: createUserDto.name,
      address: createUserDto.address
    })
    return user;
  }


  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
