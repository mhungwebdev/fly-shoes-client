import BaseModel from "./base-model";

export default class Brand extends BaseModel {
        BrandID:number = 0;

        BrandName:string = "";

        BrandSlogan:string = "";
        
        DescriptionShot:string = "";

        DescriptionDetail:string = "";

        BrandLogo:string = "";
        VoucherID:number | null = null;
}