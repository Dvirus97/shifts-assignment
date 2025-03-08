import { useEffect, useState } from "react";
import { colorMap } from "../../shared/colors";
import { hebrew } from "../../shared/translate";
import { emptyRow, TableType } from "../../shared/types/tableType";
import { DATA_STORAGE_KEY, groupBy } from "../../shared/Utils";

let timerRef: number;

export function Table2({ usersChanged }: { usersChanged?: number }) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [date, setDate] = useState(
        localStorage.getItem("shift-date") || new Date().toISOString().split("T")[0]
    );
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

    useEffect(() => {
        setTable((table) => {
            return {
                ...table,
                rows: table.rows.map((row) => {
                    return {
                        ...row,
                        cells: row.cells.map((cell) => {
                            cell.color = colorMap.get(cell.value) || "";
                            return cell;
                        }),
                    };
                }),
            };
        });
    }, [usersChanged]);

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
                                    <span
                                        style={{
                                            marginInlineStart: "0.5rem",
                                        }}
                                    >
                                        ({x.rowName} {x.name})
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    function addNewRow(index?: number) {
        let _table: TableType | undefined;
        if (index != undefined) {
            setTable((table) => {
                _table = {
                    ...table,
                    rows: [...table.rows.slice(0, index), emptyRow(), ...table.rows.slice(index)],
                };
                return _table;
            });
        } else {
            setTable((table) => {
                _table = {
                    ...table,
                    rows: [...table.rows, emptyRow()],
                };
                return _table;
            });
        }

        setTimeout(() => {
            localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(_table));
        }, 1000);
    }

    function removeRow(rowId: string): void {
        let _table: TableType | undefined;
        setTable((table) => {
            _table = {
                ...table,
                rows: table.rows.filter((row) => row.id !== rowId),
            };
            return _table;
        });
        setTimeout(() => {
            localStorage.setItem(DATA_STORAGE_KEY, JSON.stringify(_table));
        }, 1000);
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
        }, 1000);
    }

    function clearTable() {
        setTable((table) => {
            document.querySelector<HTMLDialogElement>("#clearTableDialog")?.close();
            return {
                ...table,
                rows: table.rows.map((row) => {
                    return {
                        ...row,
                        cells: row.cells.map((cell, index) => {
                            if (index == 0) return cell;
                            return {
                                ...cell,
                                value: "",
                                color: "",
                            };
                        }),
                    };
                }),
            };
        });
    }

    function clearTableDialog() {
        return (
            <dialog
                id="clearTableDialog"
                style={{
                    width: "30rem",
                }}
            >
                <h1>אתה בטוח שאתה רוצה לרוקן את הטבלה? </h1>
                <h2>כל העובדים בטבלה ימחקו</h2>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        onClick={() => {
                            document.querySelector<HTMLDialogElement>("#clearTableDialog")?.close();
                        }}
                    >
                        לא, ביטול
                    </button>
                    <button
                        style={{
                            backgroundColor: "red",
                        }}
                        onClick={clearTable}
                    >
                        כן, לרוקן את הטבלה
                    </button>
                </div>
            </dialog>
        );
    }

    return (
        <>
            {clearTableDialog()}
            <datalist id="names">
                {nameList.map((name) => {
                    return <option value={name} key={name}></option>;
                })}
            </datalist>
            <button
                onClick={() => {
                    document.querySelector<HTMLDialogElement>("#clearTableDialog")?.showModal();
                }}
            >
                {hebrew.clearAll}
            </button>
            <button onClick={() => setEditMode(false)}>
                <i className="fa-solid fa-floppy-disk"></i> {hebrew.save}
            </button>{" "}
            <button onClick={() => setEditMode(true)}>
                <i className="fa-solid fa-pencil"></i> {hebrew.edit}
            </button>
            <br />
            <br />
            <br />
            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                    marginInlineStart: "2rem",
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
                        <th>
                            {editMode && (
                                <>
                                    <button onClick={() => addNewRow(0)}>
                                        <i className="fa fa-circle-plus"></i>
                                    </button>
                                </>
                            )}
                        </th>
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
                    {table.rows.length == 0 && editMode && (
                        <button onClick={() => addNewRow()}> {hebrew.add}</button>
                    )}
                    {table.rows.map((row, index) => {
                        return (
                            <tr key={row.id}>
                                <td
                                    style={{
                                        minWidth: "fit-content",
                                    }}
                                >
                                    {editMode && (
                                        <>
                                            <button
                                                onClick={() => removeRow(row.id)}
                                                style={{
                                                    backgroundColor: "red",
                                                }}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                            <button onClick={() => addNewRow(index + 1)}>
                                                <i className="fa fa-circle-plus"></i>
                                            </button>
                                        </>
                                    )}
                                </td>
                                {row.cells.map((cell, index) => {
                                    return (
                                        <td key={cell.id} style={{ backgroundColor: cell.color }}>
                                            {cell.value}
                                            {editMode && (
                                                <>
                                                    <br />
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
                                                </>
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
            <div>
                <h2>{hebrew.total}</h2>
                {calculateTotalShifts()}
            </div>
        </>
    );
}
