import { useState } from "react";
import { daysHebrew } from "../../shared/days";
import { hebrew } from "../../shared/translate";
import { Cell } from "../cell/cell";
import { Row } from "./row";
import { generateId } from "../../shared/Utils";

const color = "#d0f98880";
const deleteWidth = "120px";

export function HeaderRow() {
    return (
        <Row>
            <div
                style={{
                    width: deleteWidth,
                }}
            ></div>
            <Cell editable={false} value={hebrew.shift} id={generateId()} color={color}></Cell>
            {daysHebrew.map((day) => {
                const id = generateId();
                return <Cell editable={false} key={id} id={id} value={day} color={color}></Cell>;
            })}
        </Row>
    );
}

export function BodyRow({ rowId, editMode, onDelete }: {editMode?:boolean, rowId: number; onDelete?: (id: number) => void }) {
    const [cols, setCols] = useState(
        daysHebrew.map(() => ({
            id: generateId(),
            value: "",
            color: "",
        }))
    );

    function cellChange(data: { value: string; id: number }) {
        const col = cols.find((col) => col.id === data.id);
        col!.value = data.value;
        setCols((x) => [...x]);
    }

    return (
        <Row>
            <button
                style={{
                    width: deleteWidth,
                    backgroundColor: "red",
                }}
                onClick={() => onDelete?.(rowId)}
            >
                {hebrew.delete}
            </button>
            <Cell value="morning" id={generateId()} color={color}></Cell>
            {cols.map((col, index) => (
                <Cell key={index} editMode={editMode} id={col.id} onChange={cellChange} value={col.value}></Cell>
            ))}
        </Row>
    );
}
