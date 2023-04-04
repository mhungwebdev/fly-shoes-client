import { LevelCustomer } from "@/enums";

export default class RankCustomer {
    RankID:number = 0;
    RankName:string = "";
    Min:number = 0;
    Max:number = 0;
    Level:LevelCustomer = LevelCustomer.New;
}