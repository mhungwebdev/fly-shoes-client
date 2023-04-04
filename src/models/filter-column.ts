import { FilterOperator } from "@/enums";

export default class FilterColumn {
        FieldName:string = "";

        FilterOperator:FilterOperator = FilterOperator.Equal;

        Value:any = "";
}