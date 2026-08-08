/**
 * ==========================================================
 * SHAGA TestHub
 * Repository Validator
 * Version : 1.0
 * ----------------------------------------------------------
 * Responsibility:
 * Validates question objects before they are added
 * to the repository.
 * ==========================================================
 */

class RepositoryValidator {

    /**
     * Validate a single question object
     */
    validate(question) {

        if (!question)
            return false;

        if (!question.question)
            return false;

        if (!question.options)
            return false;

        if (!question.answer && question.answer !== 0)
            return false;

        return true;

    }

}

export default RepositoryValidator;