import { ModelState } from "@/enums";

export default class BaseModel {
    CreatedBy:string = "";
    CreatedDate:Date = new Date();
    ModifiedBy:string = "";
    ModifiedDate:Date = new Date();
    State:ModelState = ModelState.None
}