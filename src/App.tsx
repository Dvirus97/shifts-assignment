import { useState } from "react";
import "./App.css";
import { Table2 } from "./components/table2/table2";
import { Users } from "./components/users/users";
import { hebrew } from "./shared/translate";

function App() {
    const [usersChanged, setUsersChanged] = useState<number>(0);

    return (
        <>
            <h1>{hebrew.appName}</h1>

            <Users usersChanged={() => setUsersChanged((x) => x+1)} />

            <br />
            <br />
            {/* <Table /> */}
            <Table2 usersChanged={usersChanged} />
        </>
    );
}

export default App;
