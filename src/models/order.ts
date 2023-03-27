import { OrderStatus } from "@/enums";

export default class Order {
    OrderID:number = 0;
    UserID:number = 0;
    VoucherID:number | null = null;
    Status:OrderStatus = OrderStatus.Pending;
    ReceiverName:string = "";
    ReceiverPhone:string = "";
    ReceiverAddress:string = "";
}