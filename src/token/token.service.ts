import { Injectable } from '@nestjs/common';
import {User} from "../users/users.model";
import {JwtService} from "@nestjs/jwt";
import {InjectModel} from "@nestjs/sequelize";
import {Tokens} from "./token.model";
import {register} from "tsconfig-paths";

@Injectable()
export class TokenService {

    constructor(private jwtService: JwtService,
                @InjectModel(Tokens) private tokensModel: typeof Tokens) {}

    async generateToken(user: User) { // функция генерации токенов
        const payload = {email: user.email, id: user.id, role: user.role, rolesId: user.rolesId}; // пэйлоад - это то, что попадет во внутрь самого токена. Можно передавать все нужные данные
        return {
            accessToken: this.jwtService.sign(payload, {secret: process.env.JWT_ACCESS_SECRET, expiresIn: '30m'}),
            refreshToken: this.jwtService.sign(payload, {secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d'})
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await this.tokensModel.findOne({where: {userId}});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await this.tokensModel.create({userId: userId, refreshToken: refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await this.tokensModel.findOne({where: {refreshToken: refreshToken}});
        return tokenData.destroy();
    }
}
