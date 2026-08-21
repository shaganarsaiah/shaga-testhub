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

console.log("Config Topic:", config.topic);
console.log("Available Topics:", [...new Set(questions.map(q => q.topic))]);
    // Topic
    // Topics - supports multiple topic selection
if (
    Array.isArray(config.topics) &&
    config.topics.length > 0
) {

    questions = questions.filter(q =>
        config.topics.includes(q.topic)
    );

}
// Backward compatibility with old single-topic tests
else if (config.topic) {

    questions = questions.filter(q =>
        q.topic === config.topic
    );

}

console.log(
    "Selected Topics:",
    config.topics || [config.topic]
);

console.log(
    "After Topics:",
    questions.length
);

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

    // ==========================================================
// BALANCED MULTI-TOPIC QUESTION SELECTION
// ==========================================================

if (
    Array.isArray(config.topics) &&
    config.topics.length > 1 &&
    config.questionCount
) {

    const requestedCount = Number(config.questionCount);

    const selectedTopics = config.topics;

    const topicPools = {};

    // Create separate pool for every selected topic
    selectedTopics.forEach(topicName => {

        topicPools[topicName] = questions
            .filter(q => q.topic === topicName)
            .sort(() => Math.random() - 0.5);

    });


    const balancedQuestions = [];

    const baseCount =
        Math.floor(
            requestedCount /
            selectedTopics.length
        );

    let remainder =
        requestedCount %
        selectedTopics.length;


    // First distribute questions equally
    selectedTopics.forEach(topicName => {

        let takeCount = baseCount;

        if (remainder > 0) {
            takeCount++;
            remainder--;
        }

        const selected =
            topicPools[topicName]
                .splice(0, takeCount);

        balancedQuestions.push(
            ...selected
        );

    });


    // If any topic did not contain enough questions,
    // fill remaining places from other selected topics.
    if (
        balancedQuestions.length <
        requestedCount
    ) {

        let remainingPool = [];

        selectedTopics.forEach(topicName => {

            remainingPool.push(
                ...topicPools[topicName]
            );

        });

        remainingPool =
            remainingPool.sort(
                () => Math.random() - 0.5
            );


        const needed =
            requestedCount -
            balancedQuestions.length;

        balancedQuestions.push(
            ...remainingPool.slice(0, needed)
        );

    }


    // Final shuffle so topics are mixed in the CBT
    questions =
        balancedQuestions.sort(
            () => Math.random() - 0.5
        );

}


// ==========================================================
// SINGLE TOPIC / NORMAL TEST
// ==========================================================

else {

    // Shuffle available questions
    questions =
        questions.sort(
            () => Math.random() - 0.5
        );

    if (config.questionCount) {

        questions =
            questions.slice(
                0,
                config.questionCount
            );

    }

}
    console.log("Final Questions:", questions.length);

    return questions;
}

}
export default TestGenerator;