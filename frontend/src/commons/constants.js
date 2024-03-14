const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_ENDPOINTS = {
  FACULTY: `${BASE_URL}/opportunity_finder/stanford/faculty`,
  MATCH: (professorName, collaboratorName) =>
    `${BASE_URL}/opportunity_finder/stanford/match?professorName=${professorName}&collaboratorName=${collaboratorName}`,
};

export { API_ENDPOINTS };
