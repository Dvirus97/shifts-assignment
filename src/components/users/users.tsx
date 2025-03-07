import { KeyboardEvent, useEffect, useState } from "react";
import { hebrew } from "../../shared/translate";
import { colorMap, getRandomColor } from "../../shared/colors";
import { COLORS_STORAGE_KEY } from "../../shared/Utils";

export function Users() {
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
    }
    function deleteUser() {
        colorMap.delete(user);
        setUser("");
        save();
    }

    function clearUsers() {
        colorMap.clear();
        save();
    }

    function inputKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
        if(event.code == "Enter"){
            addUser()
        }
    }

    return (
        <div>
            <h2>{hebrew.employees}</h2>
            <button onClick={clearUsers}>{hebrew.clearAll}</button>
            <br />
            <button onClick={addUser}>{hebrew.add}</button>
            <button onClick={deleteUser}>{hebrew.delete}</button>
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
