import { KeyboardEvent, useEffect, useState } from "react";
import { hebrew } from "../../shared/translate";
import { colorMap, getRandomColor } from "../../shared/colors";
import { COLORS_STORAGE_KEY } from "../../shared/Utils";

export function Users({ usersChanged }: { usersChanged?: () => void }) {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState<string[]>([]);

    useEffect(() => {
        const colorsStr = localStorage.getItem(COLORS_STORAGE_KEY);
        if (colorsStr) {
            const colors = JSON.parse(colorsStr) as [string, string][];
            colors.forEach(([key, value]) => {
                colorMap.set(key, value);
            });
            setUsers([...colorMap.keys()]);
        }
    }, []);

    function save() {
        localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify([...colorMap]));
        setUsers([...colorMap.keys()]);
    }

    function addUser() {
        colorMap.set(user, getRandomColor());
        setUser("");
        save();
        usersChanged?.();
    }
    function deleteUser() {
        colorMap.delete(user);
        setUser("");
        save();
        usersChanged?.();
    }

    function clearUsers() {
        colorMap.clear();
        save();
        document.querySelector<HTMLDialogElement>("#clearAllUsersDialog")?.close();
        usersChanged?.();
    }

    function inputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key == "Enter") {
            addUser();
        }
    }

    function clearAllDialog() {
        return (
            <dialog
                id="clearAllUsersDialog"
                style={{
                    width: "30rem",
                }}
            >
                <h1>האם אתה בטוח שאתה רוצה למחוק את כל העובדים מהמערכת? </h1>

                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        justifyContent: "space-between",
                    }}
                >
                    <button
                        onClick={() => {
                            document
                                .querySelector<HTMLDialogElement>("#clearAllUsersDialog")
                                ?.close();
                        }}
                    >
                        לא, ביטול
                    </button>
                    <button
                        style={{
                            backgroundColor: "red",
                        }}
                        onClick={clearUsers}
                    >
                        כן, למחוק את כולם
                    </button>
                </div>
            </dialog>
        );
    }

    return (
        <div>
            {clearAllDialog()}
            <h2>{hebrew.employees}</h2>
            <button
                onClick={() => {
                    document.querySelector<HTMLDialogElement>("#clearAllUsersDialog")?.showModal();
                }}
            >
                {hebrew.clearAll}
            </button>{" "}
            <button onClick={addUser}>
                <i className="fa fa-circle-plus"></i> {hebrew.add}
            </button>{" "}
            <button onClick={deleteUser}>
                <i className="fa fa-trash"></i> {""}
                {hebrew.delete}
            </button>
            <input
                type="text"
                value={user}
                onChange={(e) => {
                    setUser(e.target.value);
                }}
                onKeyDown={inputKeyDown}
            />
            <br />
            <br />
            <div>
                {users.map((value) => {
                    return <span key={value}>{value} | </span>;
                })}
            </div>
        </div>
    );
}
