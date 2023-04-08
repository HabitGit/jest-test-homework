import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';

async function start() { // Функция старта сервера
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule); // Создание экземпляр самого приложения

    app.use(cookieParser());
    // app.useGlobalGuards(JwtAuthGuard)  Для добавление гуардов глобально

    await app.listen(PORT, () => console.log(`Server was started on ${PORT} potr...`));
}


start();
