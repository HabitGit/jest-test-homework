import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

interface ProfileCreationAttrs {
    lastName: string;
    firstName: string;
    telNumber: string;
    userId: number;
    avatar: string;
}

@Table({tableName: 'profile'})
export class Profile extends Model<Profile, ProfileCreationAttrs> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;
    @Column({type: DataType.STRING})
    lastName: string;
    @Column({type: DataType.STRING})
    firstName: string;
    @Column({type: DataType.STRING})
    telNumber: string;
    @Column({type: DataType.STRING}) // В поле аватара мы храним только название файла который содержится в папке статик.
    avatar: string;

    @ForeignKey(() => User) // Ссылаемся на внутренний ключ модели юзер
    @Column({type: DataType.INTEGER})
    userId: number;

    @BelongsTo(() => User) // Говорим что принаддлежит модели юзер
    user: User;
}