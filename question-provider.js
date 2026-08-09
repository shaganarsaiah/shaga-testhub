/**
 * ==========================================================
 * SHAGA TestHub
 * Question Provider
 * ==========================================================
 */

import TestGenerator from "./generator/test-generator.js";

const generator = new TestGenerator();

/**
 * Temporary provider.
 * For now it still returns questions.js.
 * Later it will return repository-generated questions.
 */

export async function getQuestions() {

    return questions;

}