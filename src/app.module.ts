import { Module } from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { ProfileModule } from './profile/profile.module';
import {Profile} from "./profile/profile.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { RolesModule } from './roles/roles.module';
import * as path from 'path';
import {Roles} from "./roles/roles.model";
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { TextModule } from './text/text.module';
import { TokenModule } from './token/token.module';
import { GuardsModule } from './guards/guards.module';


@Module({
  imports: [
      ConfigModule.forRoot({ // Модуль для чтения файла с конфигурациями
        envFilePath: `.${process.env.NODE_ENV}.env`// Путь до файла конфигурации с системными переменными
      }),
    ServeStaticModule.forRoot({ // Модуль для отображения статических файлов
      rootPath: path.resolve(__dirname, 'static'), // Путь до папки со статикой
    }),
    SequelizeModule.forRoot({ // Модуль для базы данных
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Profile, Roles],
      autoLoadModels: true // Что бы секвалайз создавал таблицы в бд на основании наших моделей
    }),
    UsersModule,
    ProfileModule,
    FilesModule,
    RolesModule,
    AuthModule,
    MailerModule,
    TextModule,
    TokenModule,
    GuardsModule,
  ],
  controllers: [], // регистрация контроллера в приложении
  providers: [], //В провайдерах используются переиспользуемые сервисы приложения
})
export class AppModule {}
