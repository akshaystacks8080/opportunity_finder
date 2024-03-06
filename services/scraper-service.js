import { STANFORD_FACULTY_PAGE } from "../commons/constants.js";
import request from "request";
import * as cheerio from "cheerio";

async function fetchFacultyList() {
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
    return output
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

export { fetchFacultyList };
