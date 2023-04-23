import type { OrderShoes } from "@/models";
import BaseAPIConfig from "./base-api-config";

export default class VNPayService {
    controller = "VNPay"

    getURLRedirect(orderShoes:OrderShoes):Promise<string>{
        return BaseAPIConfig.post(`${this.controller}/url-redirect`,orderShoes)
    }
}