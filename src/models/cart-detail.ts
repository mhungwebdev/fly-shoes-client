import BaseModel from "./base-model";

export default class CartDetail extends BaseModel {
    CartDetailID:number = 0;

    UserID:number = 0;
    
    ShoesDetailID:number = 0;
    
    Quantity:number = 1;
    
    ColorName:string = ""
}