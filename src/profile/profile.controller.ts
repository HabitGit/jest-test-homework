import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Req,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {ProfileService} from "./profile.service";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('profile')
export class ProfileController {

    constructor(private profileService: ProfileService) {}

    @Post()
    @UseInterceptors(FileInterceptor('avatar')) // Нужно для работы с файлами, говорим какая переменная принимает файл
    createProfile(@Body() dto: CreateProfileDto,
                  @UploadedFile() avatar) { // Так же указываем это в теле запроса
        return this.profileService.create(dto, avatar)
    }

    @Get()
    getAll() {
        return this.profileService.getProfiles();
    }

    @Get('/:userId')
    getOne(@Param('userId') userId: number) {
        return this.profileService.getOne(userId);
    }

    @Put('/:userId')
    updateProfile(@Body() dto: CreateProfileDto, @Param('userId') userId: number, @Req() req: Request) {
        return this.profileService.update(dto, userId, req);
    }
}
