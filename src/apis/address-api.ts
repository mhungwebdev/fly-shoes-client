import type { ServiceResponse } from "@/models";
import BaseAPIConfig from "./base-api-config";

class AddressService {
    controller = "Address"

    getCity():Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/city`);
    }

    getDistrictByCity(code:number):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/district-by-city/${code}`);
    }

    getWardByDistrict(code:number):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/ward-by-district/${code}`);
    }
}

export default AddressService;