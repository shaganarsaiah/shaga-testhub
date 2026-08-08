/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Service
 * Version : 1.0
 * ----------------------------------------------------------
 * Responsibility:
 * Provides access to the Question Repository.
 * Other modules (Generator, Search, CBT Engine)
 * should communicate ONLY through this service.
 * ==========================================================
 */

import RepositoryLoader from "./repository-loader.js";

class RepositoryService {

    constructor() {

        this.loader = new RepositoryLoader();

    }

    /**
     * Initialize Repository
     */

    async initialize() {

        await this.loader.load();

    }

    /**
     * Check repository status
     */

    isReady() {

        return this.loader.loaded();

    }

}

export default RepositoryService;