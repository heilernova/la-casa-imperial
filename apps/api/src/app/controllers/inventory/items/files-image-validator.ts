import { FileValidator } from "@nestjs/common";

export class FilesImagesValidator extends FileValidator {
    private _err = "File is not defined";
    constructor(private readonly reg: RegExp) {
        super({});
    }

    isValid(file?: Express.Multer.File): boolean {
        if (file){
            this._err = "Field name invalid"
            return file.fieldname?.match(this.reg) ? true : false
        }
        return false;
    }
    buildErrorMessage(): string {
        return "File is not defined";
    }
}