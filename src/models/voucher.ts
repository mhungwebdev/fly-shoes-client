import { FormulaType, VoucherType } from "@/enums";
import BaseModel from "./base-model";

export default class Voucher extends BaseModel {
    VoucherID:number = 0;
    VoucherTitle:string = "";
    VoucherType:VoucherType = VoucherType.Order;
    TargetApplyID:number = 0;
    FormulaType:FormulaType = FormulaType.Percent;
    VoucherValue:number = 0;
    Quantity:number = 0;
    StartDate:Date = new Date();
    EndDate:Date = new Date();
    IDApplied:string = "";
    IsActive:boolean = false;
}