import BaseModel from "./base-model";

export default class OrderDetail extends BaseModel {
    OrderDetailID:number = 0;
    ShoesID:number = 0;
    ShoesDetailID:number = 0;
    OrderID:number = 0;
    Quantity:number = 1;
    VoucherID:number | null = null;
}