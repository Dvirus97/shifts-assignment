import { useState } from "react";
import { generateId } from "../../shared/Utils";
import { BodyRow, HeaderRow } from "../row/headerRow";
import { hebrew } from "../../shared/translate";

export function Table() {
    const [rowIds, setRowIds] = useState([generateId()]);

    const [editMode, setEditMode] = useState(false);

    function deleteRow(id: number) {
        setRowIds((prev) => {
            return prev.filter((x) => x !== id);
        });
    }

    return (
        <>
            <button onClick={()=>setEditMode(true)}>{hebrew.edit}</button>
            <button onClick={()=> setEditMode(false)}>{hebrew.save}</button>
            {/* <button>{hebrew.clear}</button> */}
            <br />
            <br />

            <HeaderRow />
            {rowIds.map((id) => {
                return (
                    <BodyRow key={id} rowId={id} onDelete={deleteRow} editMode={editMode}></BodyRow>
                );
            })}
            <br />
            <button
                onClick={() => {
                    setRowIds((prev) => {
                        return [...prev, generateId()];
                    });
                }}
            >
                + ({hebrew.add})
            </button>
        </>
    );
}
