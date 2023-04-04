import BaseModel from "./base-model";

export default class Category extends BaseModel {
    CategoryID:number = 0;

    CategoryName:string = "";
    
    CategoryDescription:string = "";

    VoucherID:number | null = null;
}