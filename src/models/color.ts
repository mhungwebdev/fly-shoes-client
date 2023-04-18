import BaseModel from "./base-model";

export default class Color extends BaseModel {
    ColorID:number = 0;

    ColorName:string = "";

    ColorCode:string = "";

    Disabled:boolean = false;
}