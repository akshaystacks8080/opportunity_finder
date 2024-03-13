import "./commons/config.js";
import express from "express";
import bodyParser from "body-parser";
import { APP_NAME, APP_PORT, SERVICE_NAME } from "./commons/constants.js";
import { FacultyManager, getFaculty } from "./services/s-service.js";
import { generateEmail } from "./ai/email-ai.js";
import { getFacultyDetails } from "./services/scraper-service.js";
import { match } from "./services/nlp-service.js";
import timeout from "connect-timeout";
import { ner } from "./services/nlp-service.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(timeout("300s"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post(`/${SERVICE_NAME}/email`, async (req, res) => {
    try {
        const result = await generateEmail(req.body);
        res.status(200).json({
            result,
        });
    } catch (error) {
        console.error(
            {
                id: `/${SERVICE_NAME}/email`,
                message: "failed to generate email",
            },
            // printing the error stacktrace
            error
        );
        //return response to client
        res.status(500).json({ error: "failed to generate email" });
    }
});

app.get(`/${SERVICE_NAME}/stanford/faculty`, async (req, res) => {
    try {
        const result = await getFaculty();
        res.status(200).json({
            result,
        });
    } catch (error) {
        console.error(
            {
                id: `/${APP_NAME}/stanford/faculty`,
                message: "failed to fetch faculty",
            },
            error
        );
        //return response to client
        res.status(500).json({ error: "failed to fetch faculty" });
    }
});

app.get(`/${SERVICE_NAME}/stanford/faculty-details`, async (req, res) => {
    try {
        const result = await getFacultyDetails(req.query.professorName);
        res.status(200).json({
            result,
        });
    } catch (error) {
        console.error(
            {
                id: `/${SERVICE_NAME}/stanford/faculty-details`,
                message: "failed to fetch faculty details",
            },
            error
        );
        //return response to client
        res.status(500).json({ error: "failed to fetch faculty details" });
    }
});

app.post(`/${SERVICE_NAME}/stanford/match`, async (req, res) => {
    try {
        // const faculty = FacultyManager.get();
        // const result = await match(req.query.professorName, faculty);
        const professorName = req.query.professorName;
        const collaboratorName = req.query.collaboratorName;

        const faculty = await getFaculty();
        const professor = await getFacultyDetails(professorName, faculty);
        const collaborator = await getFacultyDetails(collaboratorName, faculty);

        const nerResult = await ner(professor, collaborator);
        const email =  await generateEmail(nerResult)

        res.status(200).json({
            nerResult,
            email
        });
    } catch (error) {
        console.error(
            {
                id: `/${SERVICE_NAME}/stanford/match`,
                message: "failed to find match",
            },
            error
        );
        //return response to client
        res.status(500).json({ error: "failed to find match" });
    }
});

app.listen(APP_PORT, () => {
    console.log(`${APP_NAME} app listening on port ${APP_PORT}`);
});
