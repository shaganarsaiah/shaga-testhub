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
import memory from "../question-bank/subjects/educational-psychology/memory.json" with { type: "json" }
import motivation from "../question-bank/subjects/educational-psychology/motivation.json" with { type: "json" };
import intelligence from "../question-bank/subjects/educational-psychology/intelligence.json" with { type: "json" };
import personalityAdjustment from "../question-bank/subjects/educational-psychology/personality-adjustment.json" with { type: "json" };
import thinkingCreativity from "../question-bank/subjects/educational-psychology/thinking-creativity.json" with { type: "json" };
import psychologicalTesting from "../question-bank/subjects/educational-psychology/psychological-testing.json" with { type: "json" };
import individualDifferences from "../question-bank/subjects/educational-psychology/individual-differences.json" with { type: "json" };
import guidanceCounselling from "../question-bank/subjects/educational-psychology/guidance-counselling.json" with { type: "json" };
import constitutionEducation from "../question-bank/subjects/educational-philosophy/constitution-education.json" with { type: "json" };
import historicalEducation from "../question-bank/subjects/educational-philosophy/historical-education.json" with { type: "json" };
import educationalReligions from "../question-bank/subjects/educational-philosophy/educational-religions.json" with { type: "json" };
import epistemologicalFoundations from "../question-bank/subjects/educational-philosophy/epistemological-foundations.json" with { type: "json" };
import educationalThinkers from "../question-bank/subjects/educational-philosophy/educational-thinkers.json" with { type: "json" };
import educationValues from "../question-bank/subjects/educational-philosophy/education-values.json" with { type: "json" };
import societyEducation from "../question-bank/subjects/educational-philosophy/society-education.json" with { type: "json" };
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
    motivation,
    intelligence,
    personalityAdjustment,
    thinkingCreativity,
    psychologicalTesting,
    individualDifferences,
    guidanceCounselling,
    constitutionEducation,
    historicalEducation,
    educationalReligions,
    epistemologicalFoundations,
    educationalThinkers,
    educationValues,
    societyEducation,
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