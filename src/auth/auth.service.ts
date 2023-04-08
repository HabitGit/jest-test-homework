import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from "../users/dto/create-user.dto";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcryptjs';
import {CreateProfileDto} from "../profile/dto/create-profile.dto";
import {ProfileService} from "../profile/profile.service";
import * as uuid from 'uuid'
import {MailerService} from "../mailer/mailer.service";
import {TokenService} from "../token/token.service";

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
                private tokenService: TokenService,
                private profileService: ProfileService,
                private mailerService: MailerService) {}

    async login(userDto: CreateUserDto) {
        const user = await this.userService.validateUser(userDto);
        const tokens = await this.tokenService.generateToken(user);
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        return {...tokens, user};
    }

    async registration(userDto: CreateUserDto, profileUserDto: CreateProfileDto, avatar) { // для регистрации передаем данные и в юзер и в профиль, так же есть аватар
        const candidate = await this.userService.getUserByEmail(userDto.email); // проверяем есть ли такой емеил уже в БД

        if(candidate) {
            throw new HttpException('Такой пользователь уже зарегистрирован', HttpStatus.BAD_REQUEST);
        }

        const hashPassword = await bcrypt.hash(userDto.password, 3); // Хэшируем пароль, первый параметр сам пароль, вторым параметром указывается соль
        const activationLink = uuid.v4(); // создаем уникальную ссылку для активации
        const user = await this.userService.createUser({...userDto, password: hashPassword, activationLink: activationLink}); // Далее создаем юзера где разворачиваем саму dto и перезаписываем поле с паролем на хэшированный и так же с ссылкой активации
        // await this.mailerService.sendActivationMail(userDto.email, `${process.env.API_URL}/users/activate/${activationLink}`); // отправляем мэил для активации
        const tokens = await this.tokenService.generateToken(user);
        await this.tokenService.saveToken(user.id, tokens.refreshToken);
        await this.profileService.create({...profileUserDto, userId: user.id}, avatar); // сохраняем профиль и аватар для данного юзера
        return {...tokens, user: user}; // возвращаем сгенерированные jwt токены и юзера
    }

    async logout(refreshToken) {
        const token = await this.tokenService.removeToken(refreshToken);
        return token;
    }
}
