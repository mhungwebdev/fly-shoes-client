import BaseModel from "./base-model";

export default class ShoesDetail extends BaseModel {
    ShoesDetailID:number = 0;

    ShoesID:number = 0;
    
    SizeID:number = 0;

    SizeName:string = "";

    ColorID:number = 0;
    
    ColorName:string = "";

    ColorCode:string = "";
    
    Quantity:number = 0;
    
    ShoesImage:string = "";

    constructor(shoesDetailID:number) {
        super();
        this.ShoesDetailID = shoesDetailID;
        this.Quantity = 1;
    }
}