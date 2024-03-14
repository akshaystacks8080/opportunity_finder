import { fetchFacultyList } from "./scraper-service.js";
import { getFacultyDetails } from "./scraper-service.js";

async function getFaculty() {
  //structured log
  console.log({
    id: "getFaculty",
    message: "fetching faculty",
  });
  //TODO: implement
  return fetchFacultyList();
}

class _FacultyManager {
  constructor() {
    this.faculty = [];
  }

  async init() {
    const faculty = await fetchFacultyList();
    const professorList = await Promise.all(
      faculty.Faculty.slice(5).map((professor) =>
        getFacultyDetails(professor.name, faculty)
      )
    );
    this.faculty = professorList;
  }

  getAll() {
    return this.faculty;
  }
}

const FacultyManager = new _FacultyManager();

export { getFaculty, FacultyManager };
