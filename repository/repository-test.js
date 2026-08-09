/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Test
 * ==========================================================
 */

import RepositoryService from "./repository-service.js";

const repository = new RepositoryService();

repository.initialize();

console.log("");

console.log("========== CBT QUESTIONS ==========");

console.log(repository.getConvertedQuestions());