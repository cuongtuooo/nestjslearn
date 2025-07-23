import { IsMongoId, IsNotEmpty } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {
    @IsNotEmpty({ message: "email không được để tống",})
    email:string;

    @IsNotEmpty({ message: "userId không được để tống", })
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty({ message: "url không được để tống", })
    url: string;

    @IsNotEmpty({ message: "status không được để tống", })
    status: string;

    @IsNotEmpty({ message: "companyId không được để tống", })
    companyId: string

    @IsNotEmpty({ message: "jobId không được để tống", })
    jobId: mongoose.Schema.Types.ObjectId;
}

export class CreateUserCvDto { 
    @IsNotEmpty({ message: "url không được để trống"})
    url: string;

    @IsNotEmpty({ message: "company không được để trống" })
    @IsMongoId({ message: "company is a mongo id" })
    companyId: mongoose.Schema.Types.ObjectId;   

    @IsNotEmpty({ message: "jobId không được để trống" })
    @IsMongoId({ message: "jobId is a mongo id" })
    jobId: mongoose.Schema.Types.ObjectId;
}
