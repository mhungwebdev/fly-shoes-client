import type ShoesDetail from "./shoes-detail";

export default class Shoes {
    ShoesID:number = 0;

    ShoesName:string = "";

    Price:number = 0;

    ShoesImage:string = "";
    
    CategoryID:number = 0;

    CategoryName:string = "";

    BrandID:number = 0;

    BrandName:string = "";

    ShoesDetails:ShoesDetail[] = [];

    Description:string = "";

    constructor() {
        this.Price = 100000
    }
}