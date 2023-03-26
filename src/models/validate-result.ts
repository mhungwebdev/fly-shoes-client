import { ErrorCode } from "@/enums";

export default class ValidateResult {
    ErrorCode:ErrorCode = ErrorCode.NoError;

    FieldError:string = "";

    FieldValue:any;
}