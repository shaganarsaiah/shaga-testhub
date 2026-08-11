/**
 * ==========================================================
 * SHAGA TestHub
 * Question Builder
 * Version 1.0
 * ==========================================================
 */

import fs from "fs";
import TestGenerator from "../generator/test-generator.js";
import testConfig from "./test-config.json" with { type: "json" };

console.log("=================================");
console.log("SHAGA TEST BUILDER");
console.log("=================================");

const generator = new TestGenerator();
console.log("Test Configuration");
console.log(testConfig);
console.log("");

const test = generator.generateTopicTest(testConfig);
const fileContent = `const questions = ${JSON.stringify(test, null, 4)};

window.questions = questions;
`;
fs.writeFileSync(
    "questions.js",
    fileContent,
    "utf8"
);

console.log("");
console.log("questions.js generated successfully.");

console.log("");
console.log("Questions Generated :", test.length);

console.log("");

console.log(test);
