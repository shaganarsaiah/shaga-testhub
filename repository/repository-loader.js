/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Loader
 * Version 2.1
 * ==========================================================
 */

import repositoryCatalog from "./repository.json" with { type: "json" };

import growthDevelopment from "../question-bank/subjects/educational-psychology/growth-development.json" with { type: "json" };

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

        this.questionBanks.push(growthDevelopment);

        console.log("");

        console.log("Question Package Loaded");

        console.log(growthDevelopment.metadata.subject);

        console.log(growthDevelopment.metadata.topic);

        console.log(
            "Questions :",
            growthDevelopment.questions.length
        );

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