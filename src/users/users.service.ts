import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) 
    private userModel: SoftDeleteModel<UserDocument>
  ) { }

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

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "không tìm thấy user"

    return this.userModel.findOne({
      _id:id
    })
  }

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassWord(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, {...updateUserDto})
  }

  remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return "không tìm thấy user"


    return this.userModel.softDelete({
      _id: id
    })
  }
}
