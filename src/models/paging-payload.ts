import { FilterColumn, SortOrder } from ".";

export default class PagingPayload {
    PageSize: number = 15;

    PageIndex: number = 1;

    Keyword: string = "";

    SortOrder: SortOrder = new SortOrder();

    FilterColumns: FilterColumn[] = [];
    CustomParam: any;
}