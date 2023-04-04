import BaseModel from "./base-model";

export default class EmailTemplate extends BaseModel {
    EmailTemplateID:number = 0;
    
    EmailType:number = 0;

    EmailContent:string = "";
}