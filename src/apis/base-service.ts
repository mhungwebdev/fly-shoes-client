import type PagingPayload from "@/models/paging-payload";
import type {ServiceResponse} from "@/models";
import BaseAPIConfig from "./base-api-config";

class BaseService {
    controller = "";

    /**
     * Lấy tất cả
     */
    getAll(){
        return BaseAPIConfig.get(`${this.controller}`);
    }

    /**
     * Lấy theo id
     * @param id 
     * @returns 
     */
    getByID(id: number):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/${id}`);
    }

    getByField(fieldName: string,fieldValue: any):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/get-by-field?fieldName=${fieldName}&fieldValue=${fieldValue}`);
    }

    deleteByID(id:number):Promise<ServiceResponse>{
        return BaseAPIConfig.delete(`${this.controller}/${id}`);
    }

    paging(payload:PagingPayload):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/paging`, payload);
    }

    save(entity:any):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/save`, entity);
    }

    deleteMulti(ids: Array<number>):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/delete-multi`, ids);
    }

    saveList(entities: any[]):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/save-list`, entities);
    }
}

export default BaseService;