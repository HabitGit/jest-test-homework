// Файлы dto нужны для шаблона создания в бд
export class CreateUserDto {
    readonly email: string;
    readonly password: string;
    readonly isActivated: boolean;
    readonly activationLink: string;
}