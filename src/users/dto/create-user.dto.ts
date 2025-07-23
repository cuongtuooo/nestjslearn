import { Type } from 'class-transformer';
import { IsDefined, IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from 'class-validator';
import mongoose from 'mongoose';


// DATA tranfer object // class = {}
class Company {
   @IsNotEmpty()
   _id: mongoose.Schema.Types.ObjectId;

   @IsNotEmpty()
   name: string
}

export class CreateUserDto {
    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;


    @IsEmail({},{
        message: "Email không đúng định dạng"
    })
    @IsNotEmpty({
        message:"Email không được để trống"
    })
    email: string;

    @IsNotEmpty({
        message:"Mật khẩu không được để trống"
    })
    password: string;

    @IsNotEmpty({
        message: "Tuổi không được để trống"
    })
    age: string;

    @IsNotEmpty({
        message: "giới tính không được để trống"
    })
    gender: string;

    @IsNotEmpty({
        message: "address không được để trống"
    })
    address:string;

    @IsNotEmpty({
        message: "role không được để trống"
    })
    @IsMongoId({ message:"role có định dạng là mongoid"})
    role: mongoose.Schema.Types.ObjectId;   

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company!: Company;
}

export class RegisterUserDto {
    @IsNotEmpty({
        message: "name không được để trống"
    })
    name: string;


    @IsEmail({}, {
        message: "Email không đúng định dạng"
    })
    @IsNotEmpty({
        message: "Email không được để trống"
    })
    email: string;

    @IsNotEmpty({
        message: "Mật khẩu không được để trống"
    })
    password: string;

    @IsNotEmpty({
        message: "Tuổi không được để trống"
    })
    age: string;

    @IsNotEmpty({
        message: "giới tính không được để trống"
    })
    gender: string;

    @IsNotEmpty({
        message: "address không được để trống"
    })
    address: string;
}
