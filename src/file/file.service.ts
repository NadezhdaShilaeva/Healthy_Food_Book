import { Injectable } from "@nestjs/common";
import { v4 } from "uuid";
import { MFile } from "./mfile.class";
import { join } from "path";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { FileException } from "src/file/exceptions/file.exception";

@Injectable()
export class FileService {
    constructor() {}

    async createFile(file: MFile, folder: string): Promise<string> {
        try {
            const fileExtension = file.originalname.split(".").pop();
            const fileName = v4() + "." + fileExtension;

            const filePath = join(__dirname, "..", "..", "public", "images", folder);
            if (!existsSync(filePath)) {
                mkdirSync(filePath, {recursive: true});
            }

            const fullFileName = join(filePath, fileName);

            writeFileSync(fullFileName, file.buffer);

            return join("images", folder, fileName);
        } catch (error) {
            throw FileException.errorDuringFileLoad();
        }
    }

    async removeFile(fileName: string, folder: string) {
        try {
            const fullFileName = join(__dirname, "..", "..", "public", fileName);
            console.log(fullFileName);

            return unlinkSync(fullFileName);
        } catch (error) {
            console.log(error);
            throw FileException.errorDuringFileRemove();
        }
    }
}