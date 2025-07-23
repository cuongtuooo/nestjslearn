import { Body, Controller, Get, Post,  Req,  Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto, RegisterUserDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';


@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Public()
  @ResponseMessage("User login")
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(
    @Req() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.login(req.user, response); 
  }

  // @UseGuards(JwtAuthGuard)
  @Public()
  @ResponseMessage("Register a new User")
  @Post('register')
  handleRegister(
    @Body() registerUserDto: RegisterUserDto
  ) {
    // return req.user;
    return this.authService.register(registerUserDto);

  }

  @ResponseMessage("get user infomation")
  @Get('/account')
  handleGetAccount(@User() user: IUser) { //req.user
    return {user}
  }

  @Public()
  @ResponseMessage("get user by refresh token")
  @Get('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const refreshToken = request.cookies["refresh_token"]
    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage("get user by refresh token")
  @Get('/logout')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser
  ) {
    return this.authService.logout(response, user);
  }
  // @Get('profile1')
  // getProfile1(@Request() req) {
  //   return req.user;
  // }
}
