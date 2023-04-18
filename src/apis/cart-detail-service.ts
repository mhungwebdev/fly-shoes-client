import type { ServiceResponse } from "@/models";
import BaseService from "./base-service";
import BaseAPIConfig from "./base-api-config";

class CartDetailService extends BaseService {
    controller = "CartDetail"

    getCartDetailByUser(userID:number):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/cart-detail/${userID}`);
    }
}

export default CartDetailService;