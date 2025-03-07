import React from "react"

type Props= {
    children? : React.ReactNode

}

const styleRow : React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    padding: "5px",
    alignItems: "center",
}

export function Row(props: Props) {
    const  {children} = props

    if(children){
        return <div style={styleRow}>{children}</div>
    }
}