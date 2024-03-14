import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { API_ENDPOINTS } from "./commons/constants";
import { BounceLoader, RingLoader } from "react-spinners";
import { AwesomeButton } from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import { parseEmail } from "./commons/utils";

function App() {
  const [facultyList, setFacultyList] = useState([]);
  const [professorList, setProfessorList] = useState([]);
  const [collaboratorList, setCollaboratorList] = useState([]);
  const [professor, setProfessor] = useState();
  const [collaborator, setCollaborator] = useState();
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(true);
  const [isLoadingMatch, setIsLoadingMatch] = useState(false);
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");

  const onSelectProfessor = (value) => {
    setProfessor(value.value);
  };

  const onSelectCollaborator = (value) => {
    setCollaborator(value.value);
  };

  useEffect(() => {
    setIsLoadingFaculty(true);
    axios
      .get(API_ENDPOINTS.FACULTY)
      .then((response) => {
        console.log({ response: response.data });
        const facultyNames = response?.data?.result?.Faculty.map((f) => f.name);
        setFacultyList(facultyNames);
        const professorList = facultyNames.filter((f) => f !== collaborator);
        const collaboratorListNew = facultyNames.filter((f) => f !== professor);
        setProfessorList(professorList);
        setCollaboratorList(collaboratorListNew);
        setIsLoadingFaculty(false);
      })
      .catch((error) => {
        console.log("Failed to fetch faculty", error);
      });
  }, []);

  useEffect(() => {
    const professorList = facultyList.filter((f) => f !== collaborator);
    const collaboratorListNew = facultyList.filter((f) => f !== professor);
    setProfessorList(professorList);
    setCollaboratorList(collaboratorListNew);
  }, [professor, collaborator]);

  const onMatch = () => {
    setIsLoadingMatch(true);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: API_ENDPOINTS.MATCH(professor, collaborator),
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        setIsLoadingMatch(false);
        console.log({ response: response.data });
        const { subject, body } = parseEmail(response.data.email);
        setSubject(subject);
        setEmail(body);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="of-panel">
      <header className="of-header">
        <h1>Opportunity Finder</h1>

        <p>
          Tool for helping professors collaborate and find similar research
          partners.
        </p>
      </header>
      {!isLoadingFaculty ? (
        <>
          <div className="of-controls">
            <h3 className="of-control-label">Select Professor</h3>
            <Dropdown
              options={professorList}
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
          <AwesomeButton
            disabled={isLoadingMatch}
            type="primary"
            onPress={onMatch}
          >
            Match
          </AwesomeButton>
          <hr />
          <h1 className="email-subject">
            {"Subject: " + subject ? subject : null}
          </h1>
          <p className="email-body">{email ? email : null}</p>
        </>
      ) : (
        <BounceLoader color="#36d7b7" />
      )}
    </div>
  );
}

export default App;
