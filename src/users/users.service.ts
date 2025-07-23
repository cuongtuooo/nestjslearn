import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserM, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ICompany } from 'src/companies/companies.interface';
import { IUser } from './users.interface';
import aqp from 'api-query-params';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserM.name) 
    private userModel: SoftDeleteModel<UserDocument>
  ) { }

  getHashPassword = (password: string )=>{
    const salt =genSaltSync(10);
    const hash =hashSync(password, salt);
    return hash;
  }

  // cách tạo user lúc mới học 
  // async create(createUserDto: CreateUserDto) {
  //   const hassPassword = this.getHashPassword(createUserDto.password);

  //   let user = await this.userModel.create({
  //     email:createUserDto.email,
  //     password:hassPassword,
  //     name: createUserDto.name,
  //     address: createUserDto.address
  //   })
  //   return user;
  // }

  async create(createUserDto: CreateUserDto, user:IUser) {
    const { address, age, email, gender, name, password,company,role } = createUserDto

    // logic checkmail
    const isExist = await this.userModel.findOne({ email });

    if (isExist) {
      throw new BadRequestException(`email:${email} đã tồn tại`)
    }

    const hassPassword = this.getHashPassword(password);

    let newUser = await this.userModel.create({
      name,
      email,
      password: hassPassword,
      age,
      gender,
      address,
      company, role,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newUser;
    
  };

  async register(user: RegisterUserDto) {
    const {address,age,email,gender,name,password } = user
    // logic checkmail
    const isExist = await this.userModel.findOne({email});

    if (isExist) {
      throw new BadRequestException(`email:${email} đã tồn tại`)
    }

    const hassPassword = this.getHashPassword(password);
    let newRegister = await this.userModel.create({
      name,
      email,
      password:hassPassword,
      age,
      gender,
      address,
      role: "USER"
    })
    return newRegister;
  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);

    // xóa page và limit ra khỏi filter
    delete filter.current;
    delete filter.pageSize;

    // check filter
    // return {filter}


    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
      .select('-password')
    .populate(population)
    .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages,  //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if(!mongoose.Types.ObjectId.isValid(id))
      return "không tìm thấy user"

    return this.userModel.findOne({
      _id:id
    }).select("-password") //exclude >< include tức là không muốn lấy password
      .populate({ path: "role", select: {name:1, _id:1, } })
   }

  findOneByUserName(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1, permissions: 1 } })
  }

  isValidPassWord(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
      const updated= await this.userModel.updateOne(
      { _id: updateUserDto._id }, 
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email 
        }
      })
    return updated;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
    return "không tìm thấy user"
    
    const foundUser = await this.userModel.findById(id);
    if (foundUser.email === "admin@gmail.com") {
      throw new BadRequestException("Không thể xóa tài khoản admin@gmail.com")
    }

    await this.userModel.updateOne(
      { _id: id },
      {
      deletedBy: {
        _id: user._id,
        email: user.email
      }, })

    return this.userModel.softDelete({
      _id: id
    })
  }

  updateUserToken = async (refreshToken: string, _id: string)=>{
    return await this.userModel.updateOne(
      {_id},
      { refreshToken }
    )
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel.findOne({refreshToken})
  }
}
