import { ErrorCode } from "@/enums";
import type { ValidateResult } from ".";

export default class ServiceResponse {
    ErrorCode:ErrorCode = ErrorCode.NoError;

    Success:boolean = true;

    Data:any;

    ValidateInfo:ValidateResult[] = [];
}