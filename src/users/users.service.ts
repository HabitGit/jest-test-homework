import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import {isLogLevelEnabled} from "@nestjs/common/services/utils";

// В файлах сервиса прописывается вся логика работы функций для файла сонтроллера
@Injectable() // Используется для иньекции в сонтроллер
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User, // Иньекция модели юзер
                private roleService: RolesService, // Добавление сервисов
                private jwtService: JwtService) {}

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto); // Для файлов дто создается модель в директорию дто в которой указываются все нужные поля
        const role = await this.roleService.getRoleByValue("USER") // Получаем роль по значению, по умолчанию это будет user
        await user.$set('role', [role.id]); // функция set перезаписывает поле, по этому тут мы присваиваем роль пользователю по id
        user.role = [role]; // Тут мы на прямую в модель юзера добавляем поле роли для корректного отображения в lwt
        return user;
    }

    async getUsers() {
        const users = await this.userRepository.findAll({include: {all: true}}); // инклюд ставится что бы отображать всю связанную с моделью информацию
        return users;
    }

    async getUserByEmail(email: string) { // функция получения конкретного пользователя по эмейлу
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}})
        return user;
    }

    async deleteUser(id: string, req) {
        const authHeader = req.headers.authorization; // проверка на наличие авторизации(jwt)
        if(!authHeader) {
            throw new UnauthorizedException({message: 'Пользователь не авторизован'})
        }

        const user = await this.userRepository.findOne({where: {id}}); // Находим юзера по id

        if(!user) {
            throw new UnauthorizedException({message: 'Пользователь не существует'})
        }

        const token = authHeader.split(' ')[1]; // получаем токен из хэдера
        const userVerify = this.jwtService.verify(token, {secret: process.env.JWT_ACCESS_SECRET}); // расшифровываем токен

        if(userVerify.email == user.email || userVerify.rolesId == 2) { // проверка является ли авторизованный пользователь тем самым юзером или админом
            return await user.destroy(); // удаление из БД
        }

        throw new UnauthorizedException({message: 'Вы не можете удалить этого пользователя, так как им не являетесь'});

    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId, {include: {all: true}});
        const role = await this.roleService.getRoleByValue(dto.value);

        if(role && user) {
            await user.$set('role', role.id); // set перезаписывает значение
            return dto;
        }

        throw new HttpException('Пользователь или роль не нашлась', HttpStatus.NOT_FOUND)
    }

    async activation(activationLink) { // активация профиля по ссылке
        const user = await this.userRepository.findOne({where: {activationLink}}); // ищем юзера с такой же ссылкой

        if (!user) {
            throw new Error('Некорректная ссылка активации')
        }

        user.isActivated = true; // перезаписываем значение активации на true
        await user.save();
    }

    async validateUser(userDto: CreateUserDto) {
        const user = await this.getUserByEmail((userDto.email));
        const passwordEquals = await bcrypt.compare(userDto.password, user.password); // выполняем проверку совпадают ли пароли с клиента и в БД

        if(user && passwordEquals) {
            return user;
        }

        throw new UnauthorizedException({message: 'Некорректный емеил или пароль'})
    }
}
