/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Loader
 * Version : 1.0
 * ----------------------------------------------------------
 * Responsibility:
 * Loads all question banks into memory.
 * This module DOES NOT search, filter or generate tests.
 * ==========================================================
 */

class RepositoryLoader {

    constructor() {
        this.questionBanks = [];
        this.isLoaded = false;
    }

    /**
     * Load repository
     */
    async load() {

        console.log("Loading Question Repository...");

        this.isLoaded = true;

        return true;

    }

    /**
     * Returns loading status
     */

    loaded() {

        return this.isLoaded;

    }

}

export default RepositoryLoader;