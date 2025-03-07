import React from "react";

export function toggleState(setX: React.Dispatch<React.SetStateAction<boolean>>) {
    setX((prev) => !prev);
}

export function generateId() {
    return Math.floor(Math.random() * 1_000_000 * Date.now());
}

export function generateGUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function debounce<T>(func: (...args: T[]) => void, wait: number): (...args: T[]) => void {
    let timeout: number;
    return function (...args: T[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export function groupBy<T>(array: T[], keyGetter: (item: T) => string | number) {
    const map = new Map<string | number, T[]>();
    array.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export const DATA_STORAGE_KEY = "shift-data-table";
export const COLORS_STORAGE_KEY = "shift-colors";
