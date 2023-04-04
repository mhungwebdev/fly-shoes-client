import type { ServiceResponse } from "@/models";
import type { User, UserCredential } from "firebase/auth";
import BaseAPIConfig from "./base-api-config";
import BaseService from "./base-service";

class UserService extends BaseService {
    controller = "User"

    start(userCredential: User):Promise<ServiceResponse>{
        return BaseAPIConfig.post(`${this.controller}/start`, userCredential);
    }
}

export default UserService;