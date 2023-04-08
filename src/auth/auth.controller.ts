import {Body, Controller, Get, Param, Post, Req, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {CreateProfileDto} from "../profile/dto/create-profile.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request, Response} from "express";

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {
    }

    @Post('/login')
    async login(@Body() userDto: CreateUserDto,
          @Res({ passthrough: true }) res: Response) {
        const userData = await this.authService.login(userDto);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return userData;
    }

    @Post('/registration')
    @UseInterceptors(FileInterceptor('avatar'))
    async registration(@Body() userDto: CreateUserDto,
                 @Body() profileUserDto: CreateProfileDto,
                 @UploadedFile() avatar,
                 @Res({ passthrough: true }) res: Response) {
        const userData = await this.authService.registration(userDto, profileUserDto, avatar);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        return userData;
    }

    @Post('/logout')
    logout(@Req() req: Request,
           @Res({ passthrough: true }) res: Response) {
        res.clearCookie('refreshToken');
        const {refreshToken} = req.cookies;
        return this.authService.logout(refreshToken);
    }
}
