export default class ShoesDetail {
    ShoesDetailID:number = 0;

    ShoesID:number = 0;
    
    SizeID:number = 0;

    SizeName:string = "";

    ColorID:number = 0;
    
    ColorName:string = "";
    
    Quantity:number = 0;
    
    ShoesImage:string = "";

    constructor(shoesDetailID:number) {
        this.ShoesDetailID = shoesDetailID;
        this.Quantity = 1;
    }
}