import {forwardRef, Module} from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {ProfileModule} from "../profile/profile.module";
import {FilesModule} from "../files/files.module";
import {MailerModule} from "../mailer/mailer.module";
import {TokenModule} from "../token/token.module";


@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      MailerModule,
      JwtModule,
      TokenModule,
      forwardRef(() => UsersModule),
      forwardRef(() => ProfileModule),
      forwardRef(() => FilesModule),
      // JwtModule.register({ // Импорт jwt для использования
      //     secret: process.env.PRIVATE_KEY || 'SECRET', // сразу указываем в настройках приватный ключ
      //     signOptions: {
      //         expiresIn: '24h' // задаем время жизни токена
      //     }
      // })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
