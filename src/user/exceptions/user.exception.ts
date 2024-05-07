import { BadRequestException, NotFoundException } from "@nestjs/common";

export class UserException {
    static userWithEmailAlreadyExists(email: string): BadRequestException {
        return new BadRequestException(`Пользователь с email ${email} уже существует.`);
    }

    static userNotFoundException(id: number): NotFoundException {
        return new NotFoundException(`Ползователь с id ${id} не найден.`);
    }
}