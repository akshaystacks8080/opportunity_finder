import nlp from "compromise";

async function ner(professor, collaborator) {
    const itemDoc = nlp(professor.Biography);
    professor.keywords = itemDoc.topics().out("array");
    const colDoc = nlp(collaborator.Biography);
    collaborator.keywords = colDoc.topics().out("array");
    return { professor, collaborator };
}

export { ner };
