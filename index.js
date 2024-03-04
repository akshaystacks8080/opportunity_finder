import "./commons/config.js";
import express from "express";
import bodyParser from "body-parser";
import { APP_NAME, APP_PORT, SERVICE_NAME } from "./commons/constants.js";
import { getFaculty } from "./services/s-service.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get(`/${SERVICE_NAME}/mit/faculty`, async (req, res) => {
    try {
        const result = await getFaculty();
        res.status(200).json({
            result,
        });
    } catch (error) {
        console.error({
            id: `/${APP_NAME}/mit/faculty`,
            message: "failed to fetch faculty",
        });
        //return response to client
        res.status(500).json({ error: "failed to fetch faculty" });
    }
});

app.listen(APP_PORT, () => {
    console.log(`${APP_NAME} app listening on port ${APP_PORT}`);
});
