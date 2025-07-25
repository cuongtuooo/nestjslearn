import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @User() user: IUser) {
    // console.log("checkk create user: ", user)
    return this.companiesService.create(createCompanyDto, user);
  }

  @Public()
  @Get()
  @ResponseMessage("Fetch list companies with paginate")
  findAll(
    @Query("current") currentPage: string, //const curentPage: string = req.query.page;
    @Query("pageSize") limit: string,
    @Query() qs: string

  ) {
    return this.companiesService.findAll(+currentPage, +limit, qs); //currentPage convert từ string sang number
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateCompanyDto: UpdateCompanyDto, 
    @User() user:IUser
  ) {
    return this.companiesService.update(id, updateCompanyDto, user);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto, 
    @User() user: IUser //req.user
  ) {
    return this.companiesService.remove(id, updateCompanyDto, user);
  }
}
