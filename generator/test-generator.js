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

    generateTopicTest(config = {}) {

    let questions = this.repository.getConvertedQuestions();

console.log("Total loaded:", questions.length);
console.log("First Question:");
console.log(questions[0]);

    // Subjects
if (config.subjects && config.subjects.length > 0) {

    questions = questions.filter(q =>
        config.subjects.includes(q.subject)
    );

}

console.log("After Subjects:", questions.length);

    // Topic
    if (config.topic) {
        questions = questions.filter(q => q.topic === config.topic);
    }
    console.log("After Topic:", questions.length);

    // Difficulty
    if (config.difficulty && config.difficulty !== "Mixed") {
        questions = questions.filter(q => q.difficulty === config.difficulty);
    }
    console.log("After Difficulty:", questions.length);

    // Language
    if (config.language && config.language !== "Both") {
        questions = questions.filter(q => q.language === config.language);
    }
    console.log("After Language:", questions.length);

    // Shuffle
    if (config.shuffleQuestions) {
        questions = questions.sort(() => Math.random() - 0.5);
    }

    // Number of Questions
    if (config.questionCount) {
        questions = questions.slice(0, config.questionCount);
    }
    console.log("Final Questions:", questions.length);

    return questions;
}

}
export default TestGenerator;