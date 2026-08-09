import TestGenerator from "./test-generator.js";

const generator = new TestGenerator();

const questions = generator.generateTopicTest();

console.log("");

console.log("========== GENERATED TEST ==========");

console.log(questions);