import {forwardRef, Module} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/users.model";
import {Profile} from "./profile.model";
import {FilesModule} from "../files/files.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  providers: [ProfileService],
  controllers: [ProfileController],
  imports: [
      forwardRef(() => AuthModule), // для цикличных зависимостей
      SequelizeModule.forFeature([User, Profile]),
      FilesModule,
  ],
    exports: [
        ProfileService
    ]
})
export class ProfileModule {}
