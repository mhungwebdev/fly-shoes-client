import type { TabAnalyst, TimeAnalyst } from "@/enums";
import BaseAPIConfig from "./base-api-config";
import type { ServiceResponse } from "@/models";

class ReportService {
    controller = "Report"

    getReport(tab:TabAnalyst,timeAnalyst:TimeAnalyst):Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/GetReport/${tab}/${timeAnalyst}`)
    }

    analystToday():Promise<ServiceResponse>{
        return BaseAPIConfig.get(`${this.controller}/today`)
    }
}

export default ReportService;