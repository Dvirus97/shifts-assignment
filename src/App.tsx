import "./App.css";
import { Table2 } from "./components/table2/table2";
import { Users } from "./components/users/users";
import { hebrew } from "./shared/translate";

function App() {
    return (
        <>
            <h1>{hebrew.appName}</h1>

            <Users />

            <br />
            <br />
            {/* <Table /> */}
            <Table2 />
        </>
    );
}

export default App;
