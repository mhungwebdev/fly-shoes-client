import { FormulaType } from "@/enums";
import BaseModel from "./base-model";

export default class Voucher extends BaseModel {
    VoucherID:number = 0;
    VoucherTitle:string = "";
    FormulaType:FormulaType = FormulaType.Percent;
    VoucherValue:number = 1;
    Quantity:number = 1;
    EndDate:Date = new Date();
    IsActive:boolean = false;
    ShoesIDApply:number[] = [];
}