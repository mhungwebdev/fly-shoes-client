import BaseAPIConfig from "./base-api-config";
import BaseService from "./base-service";

class VoucherService extends BaseService {
    controller = "Voucher"

    checkVoucherUsage(voucherID:number,userID:number | null):Promise<boolean>{
        return BaseAPIConfig.get(`${this.controller}/check-voucher?voucherID=${voucherID}&userID=${userID}`);
    }
}

export default VoucherService;