import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { API_ENDPOINTS } from "./commons/constants";

function App() {
    const [facultyList, setFacultyList] = useState([]);
    const [collaboratorList, setCollaboratorList] = useState([]);
    const [professor, setProfessor] = useState();
    const [collaborator, setCollaborator] = useState();

    const onSelectProfessor = (value) => {
        setProfessor(value);
    };
    const onSelectCollaborator = (value) => {
        setCollaborator(value);
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
                const clist = facultyNames.filter((f) => f !== professor);
                setCollaboratorList(clist);
            })
            .catch((error) => {
                console.log("Failed to fetch faculty", error);
            });
    });

    useEffect(() => {
        const clist = facultyList.filter((f) => f !== professor);
        setCollaboratorList(clist);
    }, professor);

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
                    value={professor}
                    onChange={onSelectProfessor}
                    placeholder="Select an option"
                />
                <h3 className="of-control-label">Select Collaborator</h3>

                <Dropdown
                    options={collaboratorList}
                    value={collaborator}
                    onChange={onSelectCollaborator}
                    placeholder="Select an option"
                />
            </div>
        </div>
    );
}

export default App;
