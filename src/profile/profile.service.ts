import {Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateProfileDto} from "./dto/create-profile.dto";
import {InjectModel} from "@nestjs/sequelize";
import {Profile} from "./profile.model";
import {FilesService} from "../files/files.service";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class ProfileService {

    constructor(@InjectModel(Profile) private profileRepository: typeof Profile,
                private fileService: FilesService,
                private jwtService: JwtService) {} // Так же добавляем сервис для работы с файлами

    async create(dto: CreateProfileDto, avatar) { // Для создания профиля с аватаром получаем данные профиля и аватар по отдельности, но в профиль получаем имя файла аватара
        const profile = await this.profileRepository.create(dto); // Делаем запись в БД, готовые данные для профиля + в поле аватара сохраняем имя файла
        const data = {essenceTable: 'Profile', essenceId: profile.id};
        const fileName = await this.fileService.createFile(avatar, data); // Тут получаем ИМЯ файла аватара
        profile.avatar = fileName;
        await profile.save();
        return profile;
    }

    async update(dto: CreateProfileDto, userId: number, req) {
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }

        const profile = await this.profileRepository.findOne({where: {userId}}); // Ищем профиль по колонке userId
        const token = authHeader.split(' ')[1];
        const userVerify = this.jwtService.verify(token);

        if(userVerify.id == userId || userVerify.rolesId == 2) {
            await profile.update(dto);
            return profile;
        }

        throw new UnauthorizedException({message: 'Вы не можете обновить этот профиль, так как он не ваш'});
    }

    async getProfiles() {
        const profiles = await this.profileRepository.findAll({include: {all: true}});
        return profiles;
    }

    async getOne(userId: number) {
        const profile = await this.profileRepository.findOne({where: {userId}});
        return profile;
    }
}
