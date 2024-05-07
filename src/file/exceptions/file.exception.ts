import { InternalServerErrorException } from "@nestjs/common";

export class FileException {
    static errorDuringFileLoad(): InternalServerErrorException {
        return new InternalServerErrorException("Ошибка при записи файла с изображением.");
    }

    static errorDuringFileRemove(): InternalServerErrorException {
        return new InternalServerErrorException("Ошибка при удалении файла с изображением.");
    }
}