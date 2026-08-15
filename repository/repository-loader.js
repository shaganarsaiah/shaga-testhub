/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Loader
 * Version 2.1
 * ==========================================================
 */

import repositoryCatalog from "./repository.json" with { type: "json" };

import growthDevelopment from "../question-bank/subjects/educational-psychology/growth-development.json" with { type: "json" };
import learning from "../question-bank/subjects/educational-psychology/learning.json" with { type: "json" };
import memory from "../question-bank/subjects/educational-psychology/memory.json" with { type: "json" };
import idealism from "../question-bank/subjects/educational-philosophy/idealism.json" with { type: "json" };

class RepositoryLoader {

    constructor() {

        this.catalog = repositoryCatalog;

        this.questionBanks = [];

        this.loaded = false;

    }

    initialize() {

        console.log("========== SHAGA TestHub ==========");

        console.log("Repository Loaded");

        console.log(this.catalog);

        this.questionBanks.push(
    growthDevelopment,
    learning,
    memory,
    idealism
);

        console.log("");
console.log("Question Packages Loaded");

for (const bank of this.questionBanks) {

    console.log(bank.metadata.subject);
    console.log(bank.metadata.topic);
    console.log("Questions :", bank.questions.length);
    console.log("-------------------------");

}

        this.loaded = true;

    }

    isLoaded() {

        return this.loaded;

    }

    getCatalog() {

        return this.catalog;

    }

    getQuestionBanks() {

        return this.questionBanks;

    }

}

export default RepositoryLoader;