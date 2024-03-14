import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { API_ENDPOINTS } from "./commons/constants";

function App() {
    const [facultyList, setFacultyList] = useState([]);

    const onSelect = (value) => {
        console.log("onSelect", value);
    };

    useEffect(() => {
        axios
            .get(API_ENDPOINTS.FACULTY)
            .then((response) => {
                console.log({ response: response.data });
                const facultyNames = response?.data?.result?.Faculty.map(
                    (f) => f.name
                );
                setFacultyList(facultyNames);
            })
            .catch((error) => {
                console.log("Failed to fetch faculty", error);
            });
    });

    return (
        <div className="of-panel">
            <header className="of-header">
                <h1>Opportunity Finder</h1>

                <p>
                    Tool for helping professors collaborate and find similar
                    research partners.
                </p>
            </header>
            <div className="of-controls">
                <h3 className="of-control-label">Select Professor</h3>
                <Dropdown
                    options={facultyList}
                    value={facultyList?.[0]}
                    onChange={onSelect}
                    placeholder="Select an option"
                />
                <h3 className="of-control-label">Select Collaborator</h3>

                <Dropdown
                    options={facultyList}
                    value={facultyList?.[0]}
                    onChange={onSelect}
                    placeholder="Select an option"
                />
            </div>
        </div>
    );
}

export default App;
