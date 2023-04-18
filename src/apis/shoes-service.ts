import type { PayloadGetShoesPayment, ServiceResponse } from "@/models";
import BaseService from "./base-service";
import BaseAPIConfig from "./base-api-config";

class ShoesService extends BaseService {
    controller = "Shoes"

    getMaxPrice():Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/max-price`);
    }

    getShoesForPayment(payload:PayloadGetShoesPayment):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/shoes-for-payment`,payload);
    }
}

export default ShoesService;