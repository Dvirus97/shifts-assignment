import { hebrew } from "../translate";
import { generateGUID } from "../Utils";

export type TableType = {
    id?: string;
    rows: RowType[];
};

export type RowType = {
    id: string;
    cells: CellType[];
    name?: string;
};

export type CellType = {
    id: string;
    value: string;
    color: string;
    name?: string;
    rowName?:string
};

export function emptyCell(name?: string) {
    return {
        value: "",
        color: "",
        id: generateGUID(),
        name,
    };
}

export function emptyRow(): RowType {
    return {
        id: generateGUID(),
        cells: [
            emptyCell(hebrew.shift),
            emptyCell(hebrew.sunday),
            emptyCell(hebrew.monday),
            emptyCell(hebrew.tuesday),
            emptyCell(hebrew.wednesday),
            emptyCell(hebrew.thursday),
            emptyCell(hebrew.friday),
            emptyCell(hebrew.saturday),
        ],
    };
}
