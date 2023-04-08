import {Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UsersService} from "./users.service";
import {Roles} from "../guards/roles-auth.decorator";
import {RolesGuard} from "../guards/roles.guard";
import {AddRoleDto} from "./dto/add-role.dto";

@Controller('users')
export class UsersController {

    constructor(private usersService: UsersService) {}

    @Post()
    create(@Body() userDto: CreateUserDto) { // Говорим что телом будет userDto полученый по типу CreateUserDto
    return this.usersService.createUser(userDto); // Передаем значения в функцию сервиса
    }

    @Get()
    getAll() {
        return this.usersService.getUsers();
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT) // Http ответ
    deleteUser(@Param('id') id: string, @Req() req: Request) { // Декоратор парам исполььзуется при динамически изменяемых эндпоинтах
        return this.usersService.deleteUser(id, req);
    }

    @Roles('ADMIN') // наш собственный декоратор который принимает в себя захвание роли и передает в следующий декоратор гуард
    @UseGuards(RolesGuard) // который выдает данной роли права на действие к которой относится этот гуард
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @Get('/activate/:link')
    activation(@Param('link') link: string) {
        return this.usersService.activation(link);
    }

}
