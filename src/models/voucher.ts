import { FormulaType, VoucherType } from "@/enums";

export default class Voucher {
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
}