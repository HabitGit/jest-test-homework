import {forwardRef, Module} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "./users.model";
import {Profile} from "../profile/profile.model";
import {Roles} from "../roles/roles.model";
import {RolesModule} from "../roles/roles.module";
import {AuthModule} from "../auth/auth.module";
import {TokenModule} from "../token/token.module";

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
      SequelizeModule.forFeature([User, Profile, Roles]), // импорт моделей
      RolesModule,
      TokenModule,
      forwardRef(() => AuthModule) // такой метод импорта используется при цикличных зависимостях
  ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}
