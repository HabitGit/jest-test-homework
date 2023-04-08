import {BelongsTo, Column, DataType, ForeignKey, HasOne, Model, Table} from "sequelize-typescript";
import {Profile} from "../profile/profile.model";
import {Roles} from "../roles/roles.model";

interface UserCreationAttrs { // Тут указываются поля используемые при добавлении в БД
    email: string;
    password: string;
}

@Table({tableName: 'users'}) // Создание таблицы
export class User extends Model<User, UserCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true}) // Создание колонки.
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    isActivated: boolean;

    @Column({type: DataType.STRING, allowNull: true})
    activationLink: string;

    @ForeignKey(() => Roles) // Для айдишника роли
    @Column({type: DataType.INTEGER})
    rolesId: number;

    @BelongsTo(() => Roles) // Указывается принадлежность к роли
    role: Roles[];

    @HasOne(() => Profile) // Связь один к одному. В данном случае один юзер имеет один профиль
    profile: Profile[]; // Поле профиль, указываем его тип как модель профиль, и говорим что он массив
}