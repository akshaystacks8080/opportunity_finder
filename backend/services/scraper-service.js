import { STANFORD_FACULTY_PAGE } from "../commons/constants.js";
import request from "request";
import * as cheerio from "cheerio";
import { BASE_URL } from "../commons/constants.js";

async function fetchFacultyList() {
  console.log({
    id: "fetchFacultyList",
    message: "fetching faculty list",
  });
  const html = await fetchHtmlContent(STANFORD_FACULTY_PAGE);

  const $ = cheerio.load(html);
  const facultyList = [];

  $(".faculty-photoboard-card").each((index, element) => {
    const name = $(element).find("strong a").text().trim();
    const url = $(element).find("a").attr("href");
    const title = $(element)
      .find(".field-name-field-acad-title .field-item")
      .text()
      .trim();

    const facultyInfo = {
      name,
      url,
      title,
    };

    facultyList.push(facultyInfo);
  });

  const output = { Faculty: facultyList };
  return output;
}

async function getFacultyDetails(professorName, facultyList) {
  console.log({
    id: "getFacultyDetails",
    message: "fetching faculty details",
    professorName,
  });
  let professors = facultyList;
  if (!facultyList) {
    professors = await fetchFacultyList();
  }

  const professor = professors.Faculty.find(
    (prof) => prof.name.toLowerCase() === professorName.toLowerCase()
  );
  const html = await fetchHtmlContent(`${BASE_URL}${professor.url}`);

  const $ = cheerio.load(html);

  const facultyInfo = {
    Name: professorName,
    Biography: $("#bio-block + .read-more-target").text().trim(),
    OtherTitles: $(".field-name-field-acad-title .field-item").text().trim(),
    ProgramAffiliations: $(".field-name-field-program-affiliation .field-item")
      .map((index, element) => $(element).text().trim())
      .get(),
    ResearchInterests: $('h3:contains("Research Interests") + div p')
      .text()
      .trim()
      .split("|")
      .map((item) => item.trim()),
    RecentPublications: $('h3:contains("Recent Publications") + div p')
      .map((index, element) => $(element).text().trim())
      .get(),
  };
  return facultyInfo;
}

const fetchHtmlContent = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode !== 200) {
        reject(`Unexpected status code: ${response.statusCode}`);
      } else {
        resolve(body);
      }
    });
  });
};

export { fetchFacultyList, getFacultyDetails };
