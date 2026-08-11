/**
 * ==========================================================
 * SHAGA TestHub
 * Question Converter
 * Version 1.0
 * ==========================================================
 */

class QuestionConverter {

    /**
     * Convert one repository question
     * into CBT Engine format
     */
    convertQuestion(question) {

        const options = [
            question.options.A,
            question.options.B,
            question.options.C,
            question.options.D
        ];

        const answerMap = {
            A: 0,
            B: 1,
            C: 2,
            D: 3
        };

        return {

    question: question.question,

    options: options,

    answer: answerMap[question.correctAnswer],

    explanation: question.explanation,

    subject: question.subject,

    topic: question.topic,

    difficulty: question.difficulty,

    language: question.language,

    tags: question.tags,

    id: question.id

};

    }
}

export default QuestionConverter;