import { OrderStatus } from "@/enums";
import BaseModel from "./base-model";

export default class OrderShoes extends BaseModel {
    OrderID:number = 0;
    UserID:number = 0;
    VoucherID:number | null = null;
    Status:OrderStatus = OrderStatus.Pending;
    ReceiverName:string = "";
    ReceiverPhone:string = "";
    ReceiverAddress:string = "";
}