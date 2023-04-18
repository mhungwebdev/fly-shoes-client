import BaseModel from "./base-model";
import type Voucher from "./voucher";

export default class CartDetail extends BaseModel {
    CartDetailID:number = 0;
    UserID:number = 0;
    ShoesID:number = 0;
    ShoesImages:string = "";
    ShoesName:string = "";
    VoucherID:number = 0;
    Total:number = 0;    
    Voucher:Voucher | null = null;
    Price:number = 0;
}