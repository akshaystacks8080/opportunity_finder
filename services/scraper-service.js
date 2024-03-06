import { STANFORD_FACULTY_PAGE } from "../commons/constants.js";
import request from "request";
import * as cheerio from "cheerio";

async function fetchFacultyList() {
    const html = await fetchHtmlContent(STANFORD_FACULTY_PAGE);
    const $ = cheerio.load(html);
    const facultyData = {};

    $("h3").each((index, element) => {
        const facultyName = $(element).text().trim();
        const facultyNode = $(element).next(".col-xs-6");

        const facultyInfo = {
            name: facultyNode.find("div strong a").text().trim(),
            image: facultyNode.find("div img").attr("src"),
            title: facultyNode
                .find(".field-name-field-acad-title .field-item")
                .text()
                .trim(),
            url: facultyNode.find("div strong a").attr("href"),
        };

        facultyData[facultyName] = facultyInfo;
    });

    return facultyData;
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
