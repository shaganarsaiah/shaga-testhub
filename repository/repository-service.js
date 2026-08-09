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

        return banks[0].questions.map(question =>
            this.converter.convertQuestion(question)
        );

    }

}

export default RepositoryService;