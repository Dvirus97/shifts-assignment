import { useEffect, useState } from "react";
import { toggleState } from "../../shared/Utils";
import { colorMap } from "../../shared/colors";

type Props = {
    id: number;
    value?: string;
    color?: string;
    editable?: boolean;
    editMode?: boolean;
    onChange?: (x: { value: string; id: number }) => void;
};

export function Cell(props: Props) {
    const { id,editMode, value, onChange, editable: isEditable = true } = props;
    let { color } = props;

    const [isEditMode, setEditMode] = useState(editMode ?? false);

    useEffect(()=>{
        setEditMode(editMode ?? false)
    }, [editMode])

    const _color = colorMap.get(value ?? "");
    if (_color) {
        color = _color;
    }

    return (
        <div
            style={{
                backgroundColor: color,
                width: "150px",
                display: "flex",
                height: "60px",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
            }}
            onClick={() => {
                if (isEditable) {
                    toggleState(setEditMode);
                }
            }}
        >
            {value}
            <input
                style={{
                    display: isEditMode ? "block" : "none",
                    width: "130px",
                    textAlign: "center",
                }}
                type="text"
                value={value}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) =>
                    onChange?.({
                        value: e.target.value,
                        id: id,
                    })
                }
            />
        </div>
    );
}
