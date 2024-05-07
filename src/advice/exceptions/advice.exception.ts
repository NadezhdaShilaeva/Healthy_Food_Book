import { BadRequestException } from "@nestjs/common";

export class AdviceException {
    static adviceWithDescriptionAlreadyExists() {
        return new BadRequestException('Совет с таким описанием уже существует.');
    }
}