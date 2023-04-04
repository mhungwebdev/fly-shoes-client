import BaseModel from "./base-model";

export default class User extends BaseModel {
    UserID:number = 0;

    FullName:string = "";

    Email:string = "";

    FirebaseID:string = "";

    Address:string = "";

    IsAdmin:boolean = false;

    RankID:number = 0;

    AmountSpent:number = 0;

    Phone:string = "";
}