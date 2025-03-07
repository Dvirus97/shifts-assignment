import { useEffect, useState } from "react";
import { colorMap } from "../../shared/colors";
import { hebrew } from "../../shared/translate";
import { emptyRow, TableType } from "../../shared/types/tableType";
import { DATA_STORAGE_KEY, groupBy } from "../../shared/Utils";

let timerRef: number;

export function Table2() {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [date, setDate] = useState(localStorage.getItem('shift-date') || new Date().toISOString().split("T")[0]);
    const [table, setTable] = useState<TableType>({
        rows: Array.from({ length: 1 }).map(() => {
            return emptyRow();
        }),
    });

    const nameList = [...colorMap.keys()];

    useEffect(() => {
        const str = localStorage.getItem(DATA_STORAGE_KEY);
        if (str) {
            const data = JSON.parse(str);
            setTable(data);
        }
    }, []);

    function calculateTotalShifts() {
        table.rows.forEach((row) => {
            row.cells.forEach((cell) => {
                cell.rowName = row.name;
            });
        });

        const allCells = table.rows
            .flatMap((row) => row.cells)
            .filter((x) => x.value != x.rowName && x.value != "");

        const groups = groupBy(allCells, (x) => x.value);

        return (
            <div>
                {[...groups.entries()].map(([key, value]) => {
                    return (
                        <div
                            key={Math.random().toString() + key}
                            style={{
                                display: "flex",
                            }}
                        >
                            <b>
                                {key} ({value.length}) :
                            </b>
                            {value.map((x) => {
                                return (
                                    <span>
                                        ({x.rowName} {x.name}) {", "}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    function addNewRow() {
        setTable((table) => {
            return {
                ...table,
                rows: [...table.rows, emptyRow()],
            };
        });
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(table));
    }

    function removeRow(rowId: string): void {
        setTable((table) => {
            return {
                ...table,
                rows: table.rows.filter((row) => row.id !== rowId),
            };
        });
        localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(table));
    }

    function inputChange(value: string, cellId: string, rowId: string, index?: number) {
        const row = table.rows.find((row) => row.id == rowId);
        if (!row) return;
        const cell = row.cells.find((cell) => cell.id == cellId);
        if (!cell) return;
        const color = colorMap.get(value ?? "");
        cell.value = value;
        if (!value) {
            cell.color = "";
        }
        if (color) {
            cell.color = color;
        } else {
            cell.color = "";
        }
        if (index == 0) {
            row.name = value;
        }

        setTable((x) => ({ ...x }));
        clearTimeout(timerRef);
        timerRef = setTimeout(() => {
            localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(table));
            calculateTotalShifts();
        }, 1000);
    }

    return (
        <>
            <datalist id="names">
                {nameList.map((name) => {
                    return <option value={name} key={name}></option>;
                })}
            </datalist>
            <button onClick={() => setEditMode(true)}>{hebrew.edit}</button>
            <button onClick={() => setEditMode(false)}>{hebrew.save}</button>

            <br />
            <br />
            <br />

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginInlineStart: "9rem",
                }}
            >
                <h2>
                    {hebrew.date}: {date}
                </h2>
                {editMode && (
                    <input
                        value={date}
                        onChange={(e) => {
                            setDate(e.target.value);
                            localStorage.setItem("shift-date", e.target.value);
                        }}
                    />
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <td>{hebrew.shift}</td>
                        <th>{hebrew.sunday}</th>
                        <th>{hebrew.monday}</th>
                        <th>{hebrew.tuesday}</th>
                        <th>{hebrew.wednesday}</th>
                        <th>{hebrew.thursday}</th>
                        <th>{hebrew.friday}</th>
                        <th>{hebrew.saturday}</th>
                    </tr>
                </thead>
                <tbody>
                    {table.rows.map((row) => {
                        return (
                            <tr key={row.id}>
                                <td
                                    style={{
                                        minWidth: "fit-content",
                                    }}
                                >
                                    <button
                                        onClick={() => removeRow(row.id)}
                                        style={{
                                            backgroundColor: "red",
                                            marginInlineEnd: "3rem",
                                        }}
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </td>
                                {row.cells.map((cell, index) => {
                                    return (
                                        <td key={cell.id} style={{ backgroundColor: cell.color }}>
                                            {cell.value}
                                            {editMode && (
                                                <input
                                                    list="names"
                                                    value={cell.value}
                                                    onChange={(e) => {
                                                        inputChange(
                                                            e.target.value,
                                                            cell.id,
                                                            row.id,
                                                            index
                                                        );
                                                    }}
                                                />
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <br />
            <button onClick={() => addNewRow()}>{hebrew.add} +</button>

            <div>
                <h2>{hebrew.total}</h2>
                {calculateTotalShifts()}
            </div>
        </>
    );
}
