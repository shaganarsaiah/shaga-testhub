/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Filter
 * Version : 1.0
 * ----------------------------------------------------------
 * Responsibility:
 * Filters questions using metadata.
 * ==========================================================
 */

class RepositoryFilter {

    constructor(questionBank = []) {

        this.questionBank = questionBank;

    }

    /**
     * Filter by Subject
     */

    bySubject(subject) {

        if (!subject)
            return this.questionBank;

        return this.questionBank.filter(question =>

            question.subject === subject

        );

    }

    /**
     * Filter by Topic
     */

    byTopic(topic) {

        if (!topic)
            return this.questionBank;

        return this.questionBank.filter(question =>

            question.topic === topic

        );

    }

    /**
     * Filter by Difficulty
     */

    byDifficulty(level) {

        if (!level)
            return this.questionBank;

        return this.questionBank.filter(question =>

            question.difficulty === level

        );

    }

}

export default RepositoryFilter;