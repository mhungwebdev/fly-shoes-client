import BaseModel from "./base-model";
import type ShoesDetail from "./shoes-detail";

export default class Shoes extends BaseModel {
    ShoesID:number = 0;

    ShoesName:string = "";

    Price:number = 0;

    ShoesImages:string = "";
    
    CategoryID:number = 0;

    CategoryName:string = "";

    BrandID:number = 0;

    BrandName:string = "";

    ShoesDetails:ShoesDetail[] = [];

    constructor() {
        super();
        this.Price = 100000;
    }
}