import type { OrderShoes, ServiceResponse } from "@/models";
import BaseAPIConfig from "./base-api-config";
import BaseService from "./base-service";

class OrderShoesService extends BaseService {
    controller = "OrderShoes"

    order(paymentType:number,orderShoes:OrderShoes):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/order/${paymentType}`,orderShoes);
    }
}

export default OrderShoesService;