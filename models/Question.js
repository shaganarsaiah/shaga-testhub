/**
 * ==========================================================
 * SHAGA TestHub
 * Question Model
 * Version 2.0
 * ==========================================================
 */

class Question {

    constructor(data = {}) {

        this.id = data.id || "";

        this.assessmentType = data.assessmentType || "";

        this.exam = data.exam || "";

        this.paper = data.paper || "";

        this.className = data.className || "";

        this.subject = data.subject || "";

        this.topic = data.topic || "";

        this.lesson = data.lesson || "";

        this.difficulty = data.difficulty || "Moderate";

        this.language = data.language || "English";

        this.questionType = data.questionType || "MCQ";

        this.marks = data.marks ?? 1;

        this.negativeMarks = data.negativeMarks ?? 0;

        this.question = data.question || "";

        this.options = data.options || [];

        this.answer = data.answer ?? 0;

        this.explanation = data.explanation || "";

        this.tags = data.tags || [];

    }

}

export default Question;