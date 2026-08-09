/**
 * ==========================================================
 * SHAGA TestHub
 * Test Generator
 * Version 1.0
 * ==========================================================
 */

import RepositoryService from "../repository/repository-service.js";

class TestGenerator {

    constructor() {

        this.repository = new RepositoryService();

        this.repository.initialize();

    }

    generateTopicTest() {

        return this.repository.getConvertedQuestions();

    }

}

export default TestGenerator;