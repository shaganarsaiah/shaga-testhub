"use strict";

/* =========================================================
   SHAGA TestHub
   Static GitHub Pages Test Loader
   ========================================================= */

(async function () {

    const config = JSON.parse(
        localStorage.getItem("testConfig") || "{}"
    );

    const selectedTopics =
        Array.isArray(config.topics) && config.topics.length
            ? config.topics
            : (config.topic ? [config.topic] : []);


    /* -------------------------------------------------------
       FALLBACK
       If TestHub index.html is opened directly without
       selecting a test, preserve the old questions.js test.
       ------------------------------------------------------- */

    if (selectedTopics.length === 0) {

        loadOldStaticTest();

        return;
    }


    /* -------------------------------------------------------
       ACTIVE REPOSITORIES
       Only completed repositories are listed here.
       ------------------------------------------------------- */

    const topicFiles = {

        /* Educational Psychology */

        "Growth and Development":
            "question-bank/subjects/educational-psychology/growth-development.json",

        "Learning":
            "question-bank/subjects/educational-psychology/learning.json",

        "Memory":
            "question-bank/subjects/educational-psychology/memory.json",

        "Motivation":
            "question-bank/subjects/educational-psychology/motivation.json",

        "Intelligence":
            "question-bank/subjects/educational-psychology/intelligence.json",

        "Personality & Adjustment":
            "question-bank/subjects/educational-psychology/personality-adjustment.json",

        "Creativity & Thinking":
            "question-bank/subjects/educational-psychology/thinking-creativity.json",

        "Psychological Testing":
            "question-bank/subjects/educational-psychology/psychological-testing.json",

        "Individual Differences":
            "question-bank/subjects/educational-psychology/individual-differences.json",

        "Guidance and Counselling":
            "question-bank/subjects/educational-psychology/guidance-counselling.json",


        /* Educational Philosophy */
        
        "Historical Perspective":
            "question-bank/subjects/educational-philosophy/historical-perspective.json",

        "Religious Implications":
            "question-bank/subjects/educational-philosophy/religious-implications.json",

        "Epistemological Foundations":
            "question-bank/subjects/educational-philosophy/epistemological-foundations.json",

        "Educational Thinkers":
            "question-bank/subjects/educational-philosophy/educational-thinkers.json",
            
        "Education and Values":
            "question-bank/subjects/educational-philosophy/education-values.json"
    

    };


    const subjectMap = {

        "Foundations of Education":
            "Educational Philosophy"

    };


    try {

        const topicPools = {};


        /* ---------------------------------------------------
           LOAD EACH SELECTED REPOSITORY
           --------------------------------------------------- */

        for (const topicName of selectedTopics) {

            const filePath =
                topicFiles[topicName];

            if (!filePath) {

                console.warn(
                    "Repository not registered:",
                    topicName
                );

                topicPools[topicName] = [];

                continue;
            }


            const response =
                await fetch(filePath);


            if (!response.ok) {

                throw new Error(
                    `Could not load ${filePath}`
                );

            }


            const bank =
                await response.json();


            if (
                !bank.questions ||
                !Array.isArray(bank.questions)
            ) {

                throw new Error(
                    `Invalid repository: ${filePath}`
                );

            }


            const bankSubject =
                subjectMap[bank.metadata?.subject] ||
                bank.metadata?.subject ||
                "";


            const bankTopic =
                bank.metadata?.topic ||
                topicName;


            let converted =
                bank.questions.map(question =>
                    convertQuestion(
                        question,
                        bankSubject,
                        bankTopic,
                        bank.metadata?.language
                    )
                );


            /* Subject filter */

            if (
                Array.isArray(config.subjects) &&
                config.subjects.length > 0
            ) {

                converted =
                    converted.filter(question =>
                        config.subjects.includes(
                            question.subject
                        )
                    );

            }


            /* Difficulty filter */

            if (
                config.difficulty &&
                config.difficulty !== "Mixed"
            ) {

                converted =
                    converted.filter(question =>
                        question.difficulty ===
                        config.difficulty
                    );

            }


            /* Language filter */

            if (
                config.language &&
                config.language !== "Both"
            ) {

                converted =
                    converted.filter(question =>
                        question.language ===
                        config.language
                    );

            }


            topicPools[topicName] =
                shuffle(converted);

        }


        /* ---------------------------------------------------
           BALANCED QUESTION DISTRIBUTION
           --------------------------------------------------- */

        const requestedCount =
            Number(config.questionCount) || 20;


        const activeTopics =
            selectedTopics.filter(
                topicName =>
                    topicPools[topicName] &&
                    topicPools[topicName].length > 0
            );


        if (activeTopics.length === 0) {

            throw new Error(
                "No questions matched the selected test."
            );

        }


        const selectedQuestions = [];

        const baseCount =
            Math.floor(
                requestedCount /
                activeTopics.length
            );

        let remainder =
            requestedCount %
            activeTopics.length;


        activeTopics.forEach(topicName => {

            let takeCount =
                baseCount;

            if (remainder > 0) {

                takeCount++;

                remainder--;

            }


            selectedQuestions.push(
                ...topicPools[topicName]
                    .splice(0, takeCount)
            );

        });


        /* ---------------------------------------------------
           FILL SHORTAGE FROM REMAINING SELECTED TOPICS
           --------------------------------------------------- */

        if (
            selectedQuestions.length <
            requestedCount
        ) {

            let remainingPool = [];


            activeTopics.forEach(topicName => {

                remainingPool.push(
                    ...topicPools[topicName]
                );

            });


            remainingPool =
                shuffle(remainingPool);


            const needed =
                requestedCount -
                selectedQuestions.length;


            selectedQuestions.push(
                ...remainingPool.slice(
                    0,
                    needed
                )
            );

        }


        /* Final question mixing */

        window.questions =
            shuffle(selectedQuestions);


        console.log(
            "SHAGA TestHub Static Loader"
        );

        console.log(
            "Selected Topics:",
            selectedTopics
        );

        console.log(
            "Questions Loaded:",
            window.questions.length
        );


        if (
            !Array.isArray(window.questions) ||
            window.questions.length === 0
        ) {

            throw new Error(
                "No questions available."
            );

        }


        /* Start existing CBT engine */

        loadCBTEngine();


    } catch (error) {

        console.error(
            "SHAGA TestHub loading error:",
            error
        );

        alert(
            "The selected test could not be loaded. Please return to TestHub and select another topic."
        );

    }



    /* =====================================================
       QUESTION CONVERTER
       Same format used by question-converter.js
       ===================================================== */

    function convertQuestion(
        question,
        bankSubject,
        bankTopic,
        bankLanguage
    ) {

        const answerMap = {

            A: 0,
            B: 1,
            C: 2,
            D: 3

        };


        return {

            question:
                question.question,

            options: [

                question.options.A,
                question.options.B,
                question.options.C,
                question.options.D

            ],

            answer:
                answerMap[
                    question.correctAnswer
                ],

            explanation:
                question.explanation || "",

            subject:
                bankSubject ||
                question.subject ||
                "",

            topic:
                bankTopic ||
                question.topic ||
                "",

            difficulty:
                question.difficulty ||
                "Mixed",

            language:
                question.language ||
                bankLanguage ||
                "English",

            tags:
                question.tags || [],

            id:
                question.id || ""

        };

    }



    /* =====================================================
       SHUFFLE
       ===================================================== */

    function shuffle(array) {

        const copy =
            [...array];


        for (
            let i = copy.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );


            [
                copy[i],
                copy[j]
            ] = [
                copy[j],
                copy[i]
            ];

        }


        return copy;

    }



    /* =====================================================
       START EXISTING CBT ENGINE
       ===================================================== */

    function loadCBTEngine() {

        const script =
            document.createElement(
                "script"
            );

        script.src =
            "script.js";

        document.body.appendChild(
            script
        );

    }



    /* =====================================================
       OLD STATIC questions.js FALLBACK
       ===================================================== */

    function loadOldStaticTest() {

        const questionScript =
            document.createElement(
                "script"
            );

        questionScript.src =
            "questions.js";


        questionScript.onload =
            function () {

                loadCBTEngine();

            };


        document.body.appendChild(
            questionScript
        );

    }

})();