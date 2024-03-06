import { fetchFacultyList } from "./scraper-service.js";

async function getFaculty(){
    //structured log
    console.log({
        id:"getFaculty",
        message:'fetching faculty',
    });
    //TODO: implement
    return fetchFacultyList();
}

export {getFaculty}