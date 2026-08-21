import RepositoryLoader from "./repository-loader.js";
import QuestionConverter from "./question-converter.js";

class RepositoryService {

    constructor() {

        this.loader = new RepositoryLoader();

        this.converter = new QuestionConverter();

    }

    initialize() {

        this.loader.initialize();

    }

    getCatalog() {

        return this.loader.getCatalog();

    }

    getQuestionBanks() {

        return this.loader.getQuestionBanks();

    }

    getConvertedQuestions() {

    const banks = this.getQuestionBanks();

    if (banks.length === 0) {
        return [];
    }

    const allQuestions = [];

    for (const bank of banks) {

        if (!bank.questions) continue;

        for (const question of bank.questions) {

    const convertedQuestion = this.converter.convertQuestion(question);

    const subjectMap = {
    "Foundations of Education": "Educational Philosophy"
};

convertedQuestion.subject =
    subjectMap[bank.metadata.subject] || bank.metadata.subject;

convertedQuestion.topic = bank.metadata.topic;

    allQuestions.push(convertedQuestion);

}

    }

    return allQuestions;

}

}

export default RepositoryService;