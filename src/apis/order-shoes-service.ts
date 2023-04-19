import type { OrderShoes, ServiceResponse } from "@/models";
import BaseAPIConfig from "./base-api-config";
import BaseService from "./base-service";
import type { OrderStatus } from "@/enums";

class OrderShoesService extends BaseService {
    controller = "OrderShoes"

    order(paymentType:number,orderShoes:OrderShoes):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/order/${paymentType}`,orderShoes);
    }

    getOrderByUser():Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/order-by-user`);
    }

    updateOrderStatus(orderShoesID:number,status:OrderStatus):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/update-order-status`,{
            OrderShoesID:orderShoesID,
            OrderStatus:status
        });
    }
}

export default OrderShoesService;