"use strict";

/* =========================================================
   SHAGA TestHub v2.1
   Central Exam Configuration

   Edit this file to create a new test.
   Do not change property names.
   ========================================================= */

window.SHAGA_EXAM_CONFIG = Object.freeze({
    platform: {
        name: "SHAGA TestHub",
        motto: "Learn Faster. Revise Smarter.",
        version: "2.1"
    },

    exam: {
        id: "tgpsc-dyeo-general-studies-001",
        title: "TGPSC Dy.E.O. Mock Test",
        shortTitle: "Dy.E.O. Mock Test",
        subject: "General Studies",
        sectionName: "Section 1: General Studies",
        questionType: "Multiple Choice Question",

        durationMinutes: 50,
        marksPerCorrectAnswer: 1,
        negativeMarksPerWrongAnswer: 0,
        passingPercentage: 40,

        showGrade: true,
        showPassStatus: true,
        showExplanationsAfterSubmit: true,
        allowReviewAfterSubmit: true,
        allowPrintResult: true,
        allowRetake: true,
        autoSubmitWhenTimeEnds: true,
        saveProgressInBrowser: true,

        startQuestionNumber: 1
    },

    candidate: {
        requireName: true,
        requireRollNumber: false,
        defaultName: "Guest Candidate",
        defaultRollNumber: "",
        rememberCandidate: true
    },

    grading: [
        { minimumPercentage: 90, grade: "A+", remark: "Outstanding" },
        { minimumPercentage: 80, grade: "A", remark: "Excellent" },
        { minimumPercentage: 70, grade: "B+", remark: "Very Good" },
        { minimumPercentage: 60, grade: "B", remark: "Good" },
        { minimumPercentage: 50, grade: "C", remark: "Satisfactory" },
        { minimumPercentage: 0, grade: "D", remark: "Needs Improvement" }
    ],

    instructions: [
        "The timer begins when the test starts and cannot be paused.",
        "Select one option for each question.",
        "Use Save & Next to save the response and continue.",
        "Use Mark for Review & Next to revisit a question later.",
        "You may change or clear an answer before submitting the test.",
        "The test is submitted automatically when the timer reaches zero.",
        "Review explanations after submission when the feature is enabled."
    ],

    result: {
        heading: "SHAGA TestHub Result",
        passingLabel: "PASS",
        failingLabel: "NEEDS IMPROVEMENT",
        printDocumentTitle: "SHAGA TestHub Result",
        showQuestionWiseReport: true,
        showCandidateDetails: true,
        showTimeTaken: true,
        showAccuracy: true
    },

    storage: {
        stateKey: "shaga-testhub-v2-state",
        themeKey: "shaga-testhub-theme",
        candidateKey: "shaga-testhub-candidate"
    },

    home: {
        enabled: true,
        url: "../index.html",
        buttonText: "Home"
    }
});
