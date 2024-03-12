import nlp from "compromise";
import winkNlpI from "wink-nlp";
import similarity from "wink-nlp/utilities/similarity.js";
import model from "wink-eng-lite-web-model";

const winkNlp = winkNlpI(model);

async function ner(professor, collaborator) {
    const itemDoc = nlp(professor.Biography);
    professor.keywords = itemDoc.topics().out("array");
    const colDoc = nlp(collaborator.Biography);
    collaborator.keywords = colDoc.topics().out("array");
    return { professor, collaborator };
}

async function semanticSimilarity(sourceText, itemText, algorithm) {
    const sourceDoc = winkNlp.readDoc(sourceText);
    const itemDoc = winkNlp.readDoc(itemText);

    if (algorithm == NLP_ENGINE_CONSTANTS.DISTANCE_ALGORITHMS.TVERSKY) {
        const sourceSet = sourceDoc.tokens().out(winkNlp.its.value, winkNlp.as.set);
        const itemSet = itemDoc.tokens().out(winkNlp.its.value, winkNlp.as.set);
        const semanticSimilarity = similarity.set.tversky(sourceSet, itemSet);
        return semanticSimilarity;
    }

    const sourceBow = sourceDoc.tokens().out(winkNlp.its.value, winkNlp.as.bow);
    const itemBow = itemDoc.tokens().out(winkNlp.its.value, winkNlp.as.bow);
    const semanticSimilarity = similarity.bow.cosine(sourceBow, itemBow);
    return semanticSimilarity;
}

async function match(professorName, professorList) {
    const sourceProfessor = professorList.find(prof => prof.result.Name.toLowerCase() === professorName.toLowerCase());
    if (!sourceProfessor) {
        console.log("Professor not found");
        return;
    }

    const similarityScores = [];
    for (const professor of professorList) {
        if (professor.result.Name.toLowerCase() !== professorName.toLowerCase()) {
            const bioSimilarity = await semanticSimilarity(sourceProfessor.result.Biography, professor.result.Biography, NLP_ENGINE_CONSTANTS.DISTANCE_ALGORITHMS.COSINE);
            const interestSimilarity = await semanticSimilarity(sourceProfessor.result.ResearchInterests.join('|'), professor.result.ResearchInterests.join('|'), NLP_ENGINE_CONSTANTS.DISTANCE_ALGORITHMS.COSINE);
            const totalSimilarity = bioSimilarity + interestSimilarity;
            similarityScores.push({ professor: professor.result.Name, similarity: totalSimilarity });
        }
    }

    similarityScores.sort((a, b) => b.similarity - a.similarity);
    const topTwoSimilar = similarityScores.slice(0, 2);
    return topTwoSimilar;
}


export { ner, match };
