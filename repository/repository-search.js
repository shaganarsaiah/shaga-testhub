/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Search
 * Version : 1.0
 * ----------------------------------------------------------
 * Responsibility:
 * Searches questions from the repository.
 * ==========================================================
 */

class RepositorySearch {

    constructor(questionBank = []) {

        this.questionBank = questionBank;

    }

    /**
     * Search by keyword
     */

    byKeyword(keyword) {

        if (!keyword)
            return [];

        return this.questionBank.filter(question =>

            question.question
                .toLowerCase()
                .includes(keyword.toLowerCase())

        );

    }

}

export default RepositorySearch;