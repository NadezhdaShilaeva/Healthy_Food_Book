import { UnauthorizedException } from "@nestjs/common";

export class AuthException {
    static userWithEmailAndPasswordNotFound() {
        return new UnauthorizedException(`Пользователь не найден. Неправильный email или пароль.`);
    }
}