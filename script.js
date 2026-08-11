"use strict";

/* =========================================================
   SHAGA TestHub v1.0 Professional Edition
   Existing CBT project — Complete JavaScript Engine
   ========================================================= */

function loadExamConfigSynchronously() {
    if (window.SHAGA_EXAM_CONFIG) return;

    try {
        const request = new XMLHttpRequest();
        request.open("GET", "exam-config.js", false);
        request.send(null);

        if ((request.status >= 200 && request.status < 300) || request.status === 0) {
            (0, eval)(request.responseText);
        }
    } catch (error) {
        console.warn("exam-config.js could not be loaded. Default settings will be used.", error);
    }
}

loadExamConfigSynchronously();

const DEFAULT_CONFIG = {
    platform: { name: "SHAGA TestHub", motto: "Learn Faster. Revise Smarter." },
    exam: {
        title: "TGPSC Dy.E.O. Mock Test",
        subject: "General Studies",
        sectionName: "Section 1: General Studies",
        questionType: "Multiple Choice Question",
        durationMinutes: 30,
        marksPerCorrectAnswer: 1,
        negativeMarksPerWrongAnswer: 0,
        passingPercentage: 40,
        autoSubmitWhenTimeEnds: true,
        saveProgressInBrowser: true
    },
    candidate: { defaultName: "Guest Candidate" },
    grading: [
        { minimumPercentage: 90, grade: "A+", remark: "Outstanding" },
        { minimumPercentage: 80, grade: "A", remark: "Excellent" },
        { minimumPercentage: 70, grade: "B+", remark: "Very Good" },
        { minimumPercentage: 60, grade: "B", remark: "Good" },
        { minimumPercentage: 50, grade: "C", remark: "Satisfactory" },
        { minimumPercentage: 0, grade: "D", remark: "Needs Improvement" }
    ],
    instructions: [],
    result: { heading: "SHAGA TestHub Result", passingLabel: "PASS", failingLabel: "NEEDS IMPROVEMENT" },
    storage: { stateKey: "shaga-testhub-v2-state", themeKey: "shaga-testhub-theme" },
    home: { enabled: true, url: "../index.html", buttonText: "Home" }
};

const CONFIG = window.SHAGA_EXAM_CONFIG || DEFAULT_CONFIG;
const EXAM_CONFIG = CONFIG.exam || DEFAULT_CONFIG.exam;

const testConfig = JSON.parse(localStorage.getItem("testConfig") || "{}");
EXAM_CONFIG.subject = testConfig.subject || EXAM_CONFIG.subject;
EXAM_CONFIG.sectionName = testConfig.subject || EXAM_CONFIG.sectionName;
EXAM_CONFIG.title = testConfig.subject || EXAM_CONFIG.title;
const selectedTime =
    Number(testConfig.time) ||
    Number(EXAM_CONFIG.durationMinutes) ||
    150;

const DURATION_SECONDS = selectedTime * 60;

const examQuestions = questions;

console.log("Selected Test Configuration:", testConfig);

if (
    typeof examQuestions === "undefined" ||
    !Array.isArray(examQuestions) ||
    examQuestions.length === 0
) {
    throw new Error("No questions available for the test.");
}

const STORAGE_KEY = CONFIG.storage?.stateKey || "shaga-testhub-v2-state";
const THEME_KEY = CONFIG.storage?.themeKey || "shaga-testhub-theme";

const state = {
    currentQuestion: 0,
    answers: new Array(examQuestions.length).fill(null),
    markedForReview: new Array(examQuestions.length).fill(false),
    visited: new Array(examQuestions.length).fill(false),
    totalTime: DURATION_SECONDS,
    submitted: false,
    reviewMode: false,
    timerId: null,
    startedAt: Date.now()
};

const elements = {
    appShell: document.getElementById("appShell"),
    examTitle: document.getElementById("examTitle"),
    instructionBtn: document.getElementById("instructionBtn"),
    instructionModal: document.getElementById("instructionModal"),

    questionCountMeta: document.getElementById("questionCountMeta"),
    totalMarks: document.getElementById("totalMarks"),
    resultTotalMarks: document.getElementById("resultTotalMarks"),

    questionText: document.getElementById("question-text"),
    questionNumber: document.getElementById("question-number"),
    options: document.getElementById("options"),

    currentQuestion: document.getElementById("current-question"),
    totalQuestion: document.getElementById("total-question"),
    progressPercent: document.getElementById("progressPercent"),
    progressFill: document.getElementById("progress-fill"),

    answered: document.getElementById("answered"),
    remaining: document.getElementById("remaining"),
    reviewCount: document.getElementById("reviewCount"),
    notVisitedCount: document.getElementById("notVisitedCount"),

    palette: document.getElementById("palette"),
    paletteToggle: document.getElementById("paletteToggle"),

    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    clearBtn: document.getElementById("clearBtn"),
    markReviewBtn: document.getElementById("markReviewBtn"),
    submitBtn: document.getElementById("submitBtn"),

    timer: document.getElementById("timer"),
    timerBox: document.getElementById("timerBox"),

    submitModal: document.getElementById("submitModal"),
    confirmSubmitBtn: document.getElementById("confirmSubmitBtn"),
    submitAnswered: document.getElementById("submitAnswered"),
    submitRemaining: document.getElementById("submitRemaining"),
    submitReview: document.getElementById("submitReview"),

    resultModal: document.getElementById("resultModal"),
    resultExamTitle: document.getElementById("resultExamTitle"),
    percentageCount: document.getElementById("percentageCount"),
    correctCount: document.getElementById("correctCount"),
    wrongCount: document.getElementById("wrongCount"),
    skippedCount: document.getElementById("skippedCount"),
    scoreCount: document.getElementById("scoreCount"),
    gradeCount: document.getElementById("gradeCount"),
    reviewAnswersBtn: document.getElementById("reviewAnswersBtn"),
    retakeBtn: document.getElementById("retakeBtn")
};

function setText(element, value) {
    if (element) {
        element.textContent = String(value);
    }
}

function clampInteger(value, minimum, maximum, fallback) {
    const number = Number.parseInt(value, 10);

    if (!Number.isFinite(number)) {
        return fallback;
    }

    return Math.min(maximum, Math.max(minimum, number));
}

function getAnsweredCount() {
    return state.answers.filter(answer => answer !== null).length;
}

function getReviewCount() {
    return state.markedForReview.filter(Boolean).length;
}

function getNotVisitedCount() {
    return state.visited.filter(visited => !visited).length;
}

function getProgressPercentage() {
    return Math.round((getAnsweredCount() / examQuestions.length) * 100);
}

function calculateGrade(percentage) {
    const grading = Array.isArray(CONFIG.grading) && CONFIG.grading.length
        ? [...CONFIG.grading].sort((a, b) => b.minimumPercentage - a.minimumPercentage)
        : DEFAULT_CONFIG.grading;

    const match = grading.find(item => percentage >= Number(item.minimumPercentage));
    return match?.grade || "D";
}

function getGradeRemark(percentage) {
    const grading = Array.isArray(CONFIG.grading) && CONFIG.grading.length
        ? [...CONFIG.grading].sort((a, b) => b.minimumPercentage - a.minimumPercentage)
        : DEFAULT_CONFIG.grading;
    return grading.find(item => percentage >= Number(item.minimumPercentage))?.remark || "";
}

function calculateResult() {
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    state.answers.forEach((answer, index) => {
        if (answer === null) {
            skipped += 1;
        } else if (answer === examQuestions[index].answer) {
            correct += 1;
        } else {
            wrong += 1;
        }
    });

    const marksPerCorrect = Number(EXAM_CONFIG.marksPerCorrectAnswer) || 1;
    const negativePerWrong = Math.max(0, Number(EXAM_CONFIG.negativeMarksPerWrongAnswer) || 0);
    const maximumMarks = examQuestions.length * marksPerCorrect;
    const rawScore = (correct * marksPerCorrect) - (wrong * negativePerWrong);
    const score = Math.max(0, rawScore);
    const percentage = maximumMarks ? (score / maximumMarks) * 100 : 0;

    return {
        correct,
        wrong,
        skipped,
        score,
        maximumMarks,
        percentage,
        grade: calculateGrade(percentage),
        remark: getGradeRemark(percentage)
    };
}

function saveState() {
    if (state.submitted) {
        return;
    }

    const payload = {
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        markedForReview: state.markedForReview,
        visited: state.visited,
        totalTime: state.totalTime,
        startedAt: state.startedAt,
        questionCount: examQuestions.length
    };

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
        console.warn("SHAGA TestHub could not save progress.", error);
    }
}

function restoreState() {
    let saved;

    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
        console.warn("Saved test data could not be read.", error);
        return;
    }

    if (
        !saved ||
        saved.questionCount !== examQuestions.length ||
        !Array.isArray(saved.answers) ||
        saved.answers.length !== examQuestions.length
    ) {
        return;
    }

    state.currentQuestion = clampInteger(
        saved.currentQuestion,
        0,
        examQuestions.length - 1,
        0
    );

    state.answers = saved.answers.map((answer, index) => {
        if (answer === null) return null;

        const parsed = Number.parseInt(answer, 10);
        return Number.isInteger(parsed) &&
            parsed >= 0 &&
            parsed < examQuestions[index].options.length
            ? parsed
            : null;
    });

    state.markedForReview = Array.isArray(saved.markedForReview)
        ? saved.markedForReview
            .slice(0, examQuestions.length)
            .map(Boolean)
        : new Array(examQuestions.length).fill(false);

    while (state.markedForReview.length < examQuestions.length) {
        state.markedForReview.push(false);
    }

    state.visited = Array.isArray(saved.visited)
        ? saved.visited.slice(0, examQuestions.length).map(Boolean)
        : new Array(examQuestions.length).fill(false);

    while (state.visited.length < examQuestions.length) {
        state.visited.push(false);
    }

    state.totalTime = clampInteger(
        saved.totalTime,
        0,
        DURATION_SECONDS,
        DURATION_SECONDS
    );

    state.startedAt = Number.isFinite(saved.startedAt)
        ? saved.startedAt
        : Date.now();
}

function clearSavedState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn("Saved test state could not be cleared.", error);
    }
}

function updateMetaInformation() {
    setText(elements.questionCountMeta, examQuestions.length);
    setText(elements.totalMarks, examQuestions.length * (Number(EXAM_CONFIG.marksPerCorrectAnswer) || 1));
    setText(elements.resultTotalMarks, examQuestions.length * (Number(EXAM_CONFIG.marksPerCorrectAnswer) || 1));
    setText(elements.totalQuestion, examQuestions.length);

    if (elements.resultExamTitle && elements.examTitle) {
        elements.resultExamTitle.textContent = elements.examTitle.textContent.trim();
    }
}

function updateStatus() {
    const answered = getAnsweredCount();
    const remaining = examQuestions.length - answered;
    const progress = getProgressPercentage();

    setText(elements.currentQuestion, state.currentQuestion + 1);
    setText(elements.totalQuestion, examQuestions.length);
    setText(elements.answered, answered);
    setText(elements.remaining, remaining);
    setText(elements.reviewCount, getReviewCount());
    setText(elements.notVisitedCount, getNotVisitedCount());
    setText(elements.progressPercent, `${progress}%`);

    if (elements.progressFill) {
        elements.progressFill.style.width = `${progress}%`;

        const progressBar = elements.progressFill.parentElement;
        progressBar?.setAttribute("aria-valuenow", String(progress));
    }

    updateReviewStatisticsPanel();
}

function getStatusRows() {
    return Array.from(document.querySelectorAll(".status-card .status-row"));
}

function updateReviewStatisticsPanel() {
    const rows = getStatusRows();

    if (rows.length < 4) {
        return;
    }

    const labels = rows.map(row => row.querySelector("span:nth-of-type(2)"));
    const values = rows.map(row => row.querySelector("strong"));

    if (!state.reviewMode) {
        const normalLabels = [
            "Answered",
            "Marked for Review",
            "Not Answered",
            "Not Visited"
        ];

        normalLabels.forEach((label, index) => {
            setText(labels[index], label);
        });

        setText(values[0], getAnsweredCount());
        setText(values[1], getReviewCount());
        setText(values[2], examQuestions.length - getAnsweredCount());
        setText(values[3], getNotVisitedCount());
        return;
    }

    const result = calculateResult();
    const reviewLabels = ["Correct", "Wrong", "Skipped", "Score"];

    reviewLabels.forEach((label, index) => {
        setText(labels[index], label);
    });

    setText(values[0], result.correct);
    setText(values[1], result.wrong);
    setText(values[2], result.skipped);
    setText(values[3], `${result.correct}/${examQuestions.length}`);
}

function appendReviewBadge(optionLabel, text, className) {
    const badge = document.createElement("span");
    badge.className = `review-answer-badge ${className}`;
    badge.textContent = text;
    badge.style.marginLeft = "auto";
    badge.style.fontSize = "0.75rem";
    badge.style.fontWeight = "800";
    badge.style.whiteSpace = "nowrap";
    optionLabel.appendChild(badge);
}

function createOption(question, optionText, optionIndex) {
    const optionLabel = document.createElement("label");
    optionLabel.className = "option";
    optionLabel.setAttribute("aria-checked", "false");

    const selectedAnswer = state.answers[state.currentQuestion];
    const isSelected = selectedAnswer === optionIndex;
    const isCorrect = optionIndex === question.answer;
    const isWrongSelection = isSelected && !isCorrect;

    if (isSelected) {
        optionLabel.classList.add("selected");
        optionLabel.setAttribute("aria-checked", "true");
    }

    if (state.reviewMode) {
        optionLabel.classList.add("review-option");

        if (isCorrect) {
            optionLabel.classList.add("correct-answer", "is-correct");
        }

        if (isWrongSelection) {
            optionLabel.classList.add("wrong-answer", "is-wrong");
        }
    }

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = String(optionIndex);
    radio.checked = isSelected;
    radio.disabled = state.submitted || state.reviewMode;

    const optionLetter = document.createElement("span");
    optionLetter.className = "option-letter";
    optionLetter.textContent = String.fromCharCode(65 + optionIndex);

    const optionContent = document.createElement("span");
    optionContent.className = "option-text";
    optionContent.textContent = optionText;

    radio.addEventListener("change", () => {
        selectAnswer(optionIndex);
    });

    optionLabel.append(radio, optionLetter, optionContent);

    if (state.reviewMode) {
        if (isCorrect && isSelected) {
            appendReviewBadge(
                optionLabel,
                "Your Answer • Correct",
                "correct-badge"
            );
        } else if (isCorrect) {
            appendReviewBadge(
                optionLabel,
                "Correct Answer",
                "correct-badge"
            );
        } else if (isWrongSelection) {
            appendReviewBadge(
                optionLabel,
                "Your Answer",
                "wrong-badge"
            );
        }
    }

    return optionLabel;
}

function renderReviewExplanation(question) {
    if (!state.reviewMode || !elements.options) {
        return;
    }

    const explanation = document.createElement("div");
    explanation.className = "explanation-box";
    explanation.setAttribute("role", "note");

    const icon = document.createElement("span");
    icon.textContent = "💡";
    icon.setAttribute("aria-hidden", "true");
    icon.style.marginRight = "8px";

    const heading = document.createElement("strong");
    heading.textContent = "Explanation";

    const lineBreak = document.createElement("br");

    const explanationText = document.createElement("span");
    explanationText.textContent =
        typeof question.explanation === "string" &&
        question.explanation.trim() !== ""
            ? question.explanation
            : "No explanation is available for this question.";

    explanation.append(icon, heading, lineBreak, explanationText);
    elements.options.appendChild(explanation);
}

function renderOptions(question) {
    if (!elements.options) {
        return;
    }

    elements.options.innerHTML = "";

    question.options.forEach((optionText, optionIndex) => {
        elements.options.appendChild(
            createOption(question, optionText, optionIndex)
        );
    });

    renderReviewExplanation(question);
}

function getPaletteClass(index) {
    const classes = ["palette-btn"];

    if (!state.visited[index]) {
        classes.push("not-visited");
    }

    if (state.answers[index] !== null) {
        classes.push("answered", "is-answered");
    }

    if (state.markedForReview[index]) {
        classes.push("review", "is-review", "marked-review");
    }

    if (state.reviewMode) {
        const answer = state.answers[index];

        if (answer === examQuestions[index].answer) {
            classes.push("review-correct");
        } else if (answer !== null) {
            classes.push("review-wrong");
        } else {
            classes.push("review-skipped");
        }
    }

    if (index === state.currentQuestion) {
        classes.push("current", "is-current");
    }

    return classes.join(" ");
}

function applyReviewPaletteStyle(button, index) {
    if (!state.reviewMode) {
        return;
    }

    const answer = state.answers[index];

    if (answer === examQuestions[index].answer) {
        button.style.background = "#14804a";
        button.style.borderColor = "#14804a";
        button.style.color = "#ffffff";
    } else if (answer !== null) {
        button.style.background = "#c62828";
        button.style.borderColor = "#c62828";
        button.style.color = "#ffffff";
    } else {
        button.style.background = "#667085";
        button.style.borderColor = "#667085";
        button.style.color = "#ffffff";
    }

    if (index === state.currentQuestion) {
        button.style.outline = "3px solid rgba(245, 158, 11, 0.7)";
        button.style.outlineOffset = "2px";
    }
}

function renderPalette() {
    if (!elements.palette) {
        return;
    }

    elements.palette.innerHTML = "";

    examQuestions.forEach((question, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = getPaletteClass(index);
        button.textContent = String(index + 1);
        button.setAttribute("aria-label", `Open question ${index + 1}`);

        applyReviewPaletteStyle(button, index);

        button.addEventListener("click", () => {
            openQuestion(index);
        });

        elements.palette.appendChild(button);
    });

    renderReviewLegend();
}

function renderReviewLegend() {
    const rightPanel = elements.palette?.closest(".right-panel");

    if (!rightPanel) {
        return;
    }

    rightPanel.querySelector("#reviewLegend")?.remove();

    if (!state.reviewMode) {
        return;
    }

    const legend = document.createElement("div");
    legend.id = "reviewLegend";
    legend.className = "review-result-legend";
    legend.style.display = "grid";
    legend.style.gridTemplateColumns = "repeat(3, 1fr)";
    legend.style.gap = "8px";
    legend.style.margin = "12px 0";
    legend.style.fontSize = "0.74rem";

    const items = [
        ["#14804a", "Correct"],
        ["#c62828", "Wrong"],
        ["#667085", "Skipped"]
    ];

    items.forEach(([colour, label]) => {
        const item = document.createElement("div");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.gap = "5px";

        const swatch = document.createElement("span");
        swatch.style.width = "13px";
        swatch.style.height = "13px";
        swatch.style.borderRadius = "3px";
        swatch.style.background = colour;

        const text = document.createElement("span");
        text.textContent = label;

        item.append(swatch, text);
        legend.appendChild(item);
    });

    elements.palette.insertAdjacentElement("afterend", legend);
}

function updateReviewControls() {
    const isLastQuestion = state.currentQuestion === examQuestions.length - 1;

    if (elements.nextBtn) {
        if (state.reviewMode) {
            elements.nextBtn.textContent = isLastQuestion
                ? "Back to Result"
                : "Next Question";
            elements.nextBtn.disabled = false;
        } else {
            elements.nextBtn.textContent = isLastQuestion
                ? "Review & Submit"
                : "Save & Next";
            elements.nextBtn.disabled = state.submitted;
        }
    }

    if (elements.markReviewBtn) {
        if (state.reviewMode) {
            elements.markReviewBtn.hidden = true;
        } else {
            const marked = state.markedForReview[state.currentQuestion];
            elements.markReviewBtn.hidden = false;
            elements.markReviewBtn.textContent = marked
                ? "Remove Review Mark & Next"
                : "Mark for Review & Next";
            elements.markReviewBtn.classList.toggle("active", marked);
            elements.markReviewBtn.disabled = state.submitted;
        }
    }

    if (elements.clearBtn) {
        elements.clearBtn.hidden = state.reviewMode;
        elements.clearBtn.disabled = state.submitted;
    }

    if (elements.submitBtn) {
        elements.submitBtn.hidden = state.reviewMode;
        elements.submitBtn.disabled = state.submitted;
    }

    if (elements.instructionBtn) {
        elements.instructionBtn.disabled = state.reviewMode;
    }
}

function renderQuestion() {
    const question = examQuestions[state.currentQuestion];
    state.visited[state.currentQuestion] = true;

    setText(
        elements.questionNumber,
        state.reviewMode
            ? `Review Question ${state.currentQuestion + 1} of ${examQuestions.length}`
            : `Question ${state.currentQuestion + 1}`
    );
    setText(elements.questionText, question.question);

    renderOptions(question);
    renderPalette();
    updateStatus();

    if (elements.prevBtn) {
        elements.prevBtn.disabled = state.currentQuestion === 0;
    }

    updateReviewControls();
    saveState();

    elements.questionText?.focus({ preventScroll: true });
}

function selectAnswer(optionIndex) {
    if (state.submitted || state.reviewMode) {
        return;
    }

    state.answers[state.currentQuestion] = optionIndex;
    renderQuestion();
}

function openQuestion(index) {
    if (index < 0 || index >= examQuestions.length) {
        return;
    }

    state.currentQuestion = index;
    renderQuestion();
}

function goToPreviousQuestion() {
    if (state.currentQuestion > 0) {
        openQuestion(state.currentQuestion - 1);
    }
}

function showResultModal() {
    elements.appShell?.setAttribute("aria-hidden", "true");
    showModal(elements.resultModal);
}

function goToNextQuestion() {
    if (state.currentQuestion < examQuestions.length - 1) {
        openQuestion(state.currentQuestion + 1);
        return;
    }

    if (state.reviewMode) {
        showResultModal();
        return;
    }

    if (!state.submitted) {
        openSubmitModal();
    }
}

function clearResponse() {
    if (state.submitted || state.reviewMode) {
        return;
    }

    state.answers[state.currentQuestion] = null;
    renderQuestion();
}

function markForReviewAndNext() {
    if (state.submitted || state.reviewMode) {
        return;
    }

    state.markedForReview[state.currentQuestion] =
        !state.markedForReview[state.currentQuestion];

    if (state.currentQuestion < examQuestions.length - 1) {
        openQuestion(state.currentQuestion + 1);
    } else {
        renderQuestion();
        openSubmitModal();
    }
}

function showModal(modal) {
    if (!modal) {
        console.error("SHAGA TestHub: modal element was not found.");
        return false;
    }

    modal.hidden = false;
    modal.removeAttribute("hidden");
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("show", "active");
    document.body.classList.add("modal-open");

    const focusTarget = modal.querySelector(
        "button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])"
    );
    window.requestAnimationFrame(() => focusTarget?.focus());
    return true;
}

function hideModal(modal) {
    if (!modal) {
        return false;
    }

    modal.classList.remove("show", "active");
    modal.setAttribute("aria-hidden", "true");
    modal.hidden = true;

    const anyOpenModal = document.querySelector(
        ".modal.show, .modal.active, .result-modal.show, .result-modal.active"
    );

    if (!anyOpenModal) {
        document.body.classList.remove("modal-open");
    }

    return true;
}

function openSubmitModal() {
    if (state.submitted || state.reviewMode) {
        return;
    }

    setText(elements.submitAnswered, getAnsweredCount());
    setText(elements.submitRemaining, examQuestions.length - getAnsweredCount());
    setText(elements.submitReview, getReviewCount());
    showModal(elements.submitModal);
}

function updateResultDisplay(result) {
    setText(elements.correctCount, result.correct);
    setText(elements.wrongCount, result.wrong);
    setText(elements.skippedCount, result.skipped);
    setText(elements.scoreCount, result.correct);
    setText(elements.resultTotalMarks, examQuestions.length);
    setText(elements.percentageCount, `${result.percentage.toFixed(2)}%`);
    setText(elements.gradeCount, result.grade);
    renderProfessionalResultDashboard(result);
}

function submitTest() {
    if (state.submitted) {
        return;
    }

    if (!elements.resultModal) {
        window.alert("The result panel could not be found. Please check index.html.");
        return;
    }

    state.submitted = true;
    elements.confirmSubmitBtn?.setAttribute("disabled", "disabled");

    if (state.timerId !== null) {
        window.clearInterval(state.timerId);
        state.timerId = null;
    }

    try {
        const result = calculateResult();
        updateResultDisplay(result);
        clearSavedState();
        hideModal(elements.submitModal);
        showResultModal();
    } catch (error) {
        state.submitted = false;
        elements.confirmSubmitBtn?.removeAttribute("disabled");
        console.error("SHAGA TestHub submission failed.", error);
        window.alert("The test could not be submitted. Please open the browser console and check the error.");
    }
}

function reviewAnswers() {
    state.reviewMode = true;
    state.currentQuestion = 0;

    elements.appShell?.removeAttribute("aria-hidden");
    hideModal(elements.resultModal);
    renderQuestion();
}

function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerDisplay() {
    setText(elements.timer, formatTime(state.totalTime));

    if (elements.timerBox) {
        elements.timerBox.classList.toggle(
            "timer-warning",
            state.totalTime <= 600 && state.totalTime > 300
        );
        elements.timerBox.classList.toggle(
            "timer-danger",
            state.totalTime <= 300
        );
    }
}

function startTimer() {
    updateTimerDisplay();

    state.timerId = window.setInterval(() => {
        if (state.submitted) {
            window.clearInterval(state.timerId);
            state.timerId = null;
            return;
        }

        state.totalTime -= 1;

        if (state.totalTime <= 0) {
            state.totalTime = 0;
            updateTimerDisplay();
            if (EXAM_CONFIG.autoSubmitWhenTimeEnds !== false) {
                submitTest();
            } else {
                window.clearInterval(state.timerId);
                state.timerId = null;
            }
            return;
        }

        updateTimerDisplay();
        saveState();
    }, 1000);
}

function togglePalette() {
    if (!elements.palette || !elements.paletteToggle) {
        return;
    }

    const isHidden = elements.palette.hidden;
    elements.palette.hidden = !isHidden;
    elements.paletteToggle.textContent = isHidden ? "−" : "+";
    elements.paletteToggle.setAttribute("aria-expanded", String(isHidden));
}

function bindModalCloseButtons() {
    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => {
            const modalId = button.getAttribute("data-close-modal");
            const modal = modalId ? document.getElementById(modalId) : null;
            hideModal(modal);
        });
    });
}

function printResult() {
    const result = calculateResult();
    const title = elements.examTitle?.textContent?.trim() || "SHAGA TestHub Result";

    const printWindow = window.open("", "_blank", "width=850,height=700");

    if (!printWindow) {
        window.alert("Please allow pop-ups to print the result.");
        return;
    }

    const rows = state.answers.map((answer, index) => {
        const question = examQuestions[index];
        const selectedText =
            answer === null ? "Not Answered" : question.options[answer];
        const correctText = question.options[question.answer];
        const status =
            answer === null
                ? "Skipped"
                : answer === question.answer
                    ? "Correct"
                    : "Wrong";

        return `
            <tr>
                <td>${index + 1}</td>
                <td>${escapeHtml(question.question)}</td>
                <td>${escapeHtml(selectedText)}</td>
                <td>${escapeHtml(correctText)}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join("");

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>${escapeHtml(title)}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 30px;
                    color: #1f2937;
                }
                h1, h2 {
                    color: #0b3d75;
                }
                .summary {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                    margin: 20px 0;
                }
                .summary div {
                    border: 1px solid #d8dee8;
                    padding: 12px;
                    text-align: center;
                    border-radius: 8px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                th, td {
                    border: 1px solid #cbd5e1;
                    padding: 8px;
                    vertical-align: top;
                }
                th {
                    background: #eaf2fb;
                }
                @media print {
                    button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <h1>SHAGA TestHub Result</h1>
            <h2>${escapeHtml(title)}</h2>
            <div class="summary">
                <div><strong>${result.correct}</strong><br>Correct</div>
                <div><strong>${result.wrong}</strong><br>Wrong</div>
                <div><strong>${result.skipped}</strong><br>Skipped</div>
                <div><strong>${result.percentage.toFixed(2)}%</strong><br>Percentage</div>
                <div><strong>${result.grade}</strong><br>Grade</div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Question</th>
                        <th>Your Answer</th>
                        <th>Correct Answer</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <script>
                window.addEventListener("load", () => window.print());
            <\/script>
        </body>
        </html>
    `);

    printWindow.document.close();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function goHome() {
    const confirmed = window.confirm(
        "Return to the SHAGA NOTES home page?"
    );

    if (confirmed) {
        window.location.href = CONFIG.home?.url || "../index.html";
    }
}

function getTimeTakenSeconds() {
    const configuredDuration = DURATION_SECONDS;
    return Math.max(0, configuredDuration - state.totalTime);
}

function formatLongTime(totalSeconds) {
    const safeSeconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
}

function renderProfessionalResultDashboard(result) {
    const resultCard = elements.resultModal?.querySelector(".result-card");
    const actions = elements.resultModal?.querySelector(".result-actions");

    if (!resultCard || !actions) {
        return;
    }

    const attempted = examQuestions.length - result.skipped;
    const accuracy = attempted ? (result.correct / attempted) * 100 : 0;
    const timeTaken = getTimeTakenSeconds();
    const passPercentage = Number(EXAM_CONFIG.passingPercentage) || 40;
    const passed = result.percentage >= passPercentage;

    resultCard.classList.add("professional-result-card");

    let dashboard = document.getElementById("professionalResultDashboard");

    if (!dashboard) {
        dashboard = document.createElement("section");
        dashboard.id = "professionalResultDashboard";
        dashboard.className = "professional-result-dashboard";
        actions.insertAdjacentElement("beforebegin", dashboard);
    }

    dashboard.innerHTML = `
        <div class="result-overview">
            <div class="score-ring" style="--score-angle:${Math.min(100, result.percentage) * 3.6}deg">
                <div class="score-ring-inner">
                    <strong>${result.percentage.toFixed(1)}%</strong>
                    <span>Overall Score</span>
                </div>
            </div>
            <div class="result-verdict">
                <span class="result-status ${passed ? "passed" : "needs-improvement"}">
                    ${passed ? (CONFIG.result?.passingLabel || "PASS") : (CONFIG.result?.failingLabel || "NEEDS IMPROVEMENT")}
                </span>
                <h3>${result.remark || (passed ? "Well done!" : "Keep practising!")}</h3>
                <p>You scored <strong>${result.score.toFixed(2)} out of ${result.maximumMarks.toFixed(2)}</strong>.</p>
                <small>Qualifying benchmark used: ${passPercentage}%</small>
            </div>
        </div>

        <div class="advanced-result-grid" aria-label="Detailed result statistics">
            <div><span>Attempted</span><strong>${attempted}/${examQuestions.length}</strong></div>
            <div><span>Not Attempted</span><strong>${result.skipped}</strong></div>
            <div><span>Accuracy</span><strong>${accuracy.toFixed(1)}%</strong></div>
            <div><span>Time Taken</span><strong>${formatLongTime(timeTaken)}</strong></div>
            <div><span>Correct</span><strong>${result.correct}</strong></div>
            <div><span>Wrong</span><strong>${result.wrong}</strong></div>
            <div><span>Grade</span><strong>${result.grade}</strong></div>
            <div><span>Result</span><strong>${passed ? "Passed" : "Practice More"}</strong></div>
        </div>
    `;

    let printButton = document.getElementById("printResultBtn");
    let homeButton = document.getElementById("homeBtn");

    if (!printButton) {
        printButton = document.createElement("button");
        printButton.id = "printResultBtn";
        printButton.type = "button";
        printButton.className = "secondary-button";
        printButton.textContent = "Print Result";
        printButton.addEventListener("click", printResult);
        actions.appendChild(printButton);
    }

    if (!homeButton) {
        homeButton = document.createElement("button");
        homeButton.id = "homeBtn";
        homeButton.type = "button";
        homeButton.className = "secondary-button";
        homeButton.textContent = CONFIG.home?.buttonText || "Home";
        homeButton.addEventListener("click", goHome);
        actions.appendChild(homeButton);
    }
}

function injectProfessionalStyles() {
    if (document.getElementById("shagaProfessionalStyles")) {
        return;
    }

    const style = document.createElement("style");
    style.id = "shagaProfessionalStyles";
    style.textContent = `
        .professional-result-card {
            width: min(760px, 96vw) !important;
            max-height: calc(100vh - 28px) !important;
        }

        .professional-result-dashboard {
            margin: 18px 0;
            text-align: left;
        }

        .result-overview {
            display: grid;
            grid-template-columns: 150px 1fr;
            align-items: center;
            gap: 24px;
            padding: 18px;
            border: 1px solid #dbe5f0;
            border-radius: 14px;
            background: linear-gradient(135deg, #f8fbff, #eef5fc);
        }

        .score-ring {
            width: 132px;
            height: 132px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: conic-gradient(#14804a var(--score-angle), #dbe5e1 0);
            box-shadow: 0 8px 22px rgba(15, 23, 42, .12);
        }

        .score-ring-inner {
            width: 102px;
            height: 102px;
            display: grid;
            place-content: center;
            text-align: center;
            border-radius: 50%;
            background: #fff;
        }

        .score-ring-inner strong {
            color: #0b3d75;
            font-size: 1.45rem;
        }

        .score-ring-inner span {
            color: #667085;
            font-size: .72rem;
            font-weight: 700;
        }

        .result-status {
            display: inline-flex;
            padding: 5px 12px;
            border-radius: 999px;
            font-size: .74rem;
            font-weight: 900;
            letter-spacing: .7px;
        }

        .result-status.passed {
            color: #08643a;
            background: #dff7e9;
        }

        .result-status.needs-improvement {
            color: #9b1c1c;
            background: #fde8e8;
        }

        .result-verdict h3 {
            margin: 8px 0 3px;
            color: #0b3d75;
        }

        .result-verdict p,
        .result-verdict small {
            color: #475467;
        }

        .advanced-result-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            margin-top: 12px;
        }

        .advanced-result-grid > div {
            min-height: 78px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 12px;
            border: 1px solid #d8e1eb;
            border-radius: 10px;
            background: #fff;
            text-align: center;
        }

        .advanced-result-grid span {
            color: #667085;
            font-size: .72rem;
            font-weight: 700;
        }

        .advanced-result-grid strong {
            margin-top: 4px;
            color: #123a72;
            font-size: 1rem;
        }

        @media (max-width: 650px) {
            .result-overview {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .score-ring {
                margin: auto;
            }

            .advanced-result-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
            }
        }
        .theme-toggle {
            min-height: 38px;
            padding: 8px 12px;
            border: 1px solid rgba(255,255,255,.45);
            border-radius: 8px;
            color: #fff;
            background: rgba(255,255,255,.12);
            font-weight: 700;
            cursor: pointer;
        }

        body.dark-mode {
            background: #111827;
            color: #e5e7eb;
        }

        body.dark-mode .candidate-strip,
        body.dark-mode .left-panel section,
        body.dark-mode .question-panel,
        body.dark-mode .right-panel,
        body.dark-mode .question-card,
        body.dark-mode .option,
        body.dark-mode .modal-card,
        body.dark-mode .result-card {
            background: #1f2937 !important;
            color: #e5e7eb !important;
            border-color: #374151 !important;
        }

        body.dark-mode #question-text,
        body.dark-mode h1,
        body.dark-mode h2,
        body.dark-mode h3,
        body.dark-mode strong {
            color: #f9fafb;
        }

        body.dark-mode .option {
            background: #111827 !important;
        }

        body.dark-mode .explanation-box {
            background: #172554;
            color: #dbeafe;
        }

        body.dark-mode .modal-header,
        body.dark-mode .modal-footer {
            background: #111827;
            border-color: #374151;
        }

        #resultAnalytics {
            text-align: center;
        }

        @media (max-width: 560px) {
            .theme-toggle {
                width: 100%;
            }

            .result-actions {
                flex-wrap: wrap;
            }
        }

        @media print {
            .theme-toggle {
                display: none !important;
            }
        }
    `;

    document.head.appendChild(style);
}

function applyTheme(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("dark-mode", dark);

    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.textContent = dark ? "Light Mode" : "Dark Mode";
        toggle.setAttribute("aria-pressed", String(dark));
    }

    try {
        localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (error) {
        console.warn("Theme preference could not be saved.", error);
    }
}

function initialiseThemeToggle() {
    injectProfessionalStyles();

    const headerActions = document.querySelector(".header-actions");

    if (!headerActions || document.getElementById("themeToggle")) {
        return;
    }

    const button = document.createElement("button");
    button.id = "themeToggle";
    button.type = "button";
    button.className = "theme-toggle";
    button.setAttribute("aria-label", "Toggle dark mode");

    button.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("dark-mode")
            ? "light"
            : "dark";
        applyTheme(nextTheme);
    });

    headerActions.insertBefore(button, elements.timerBox || null);

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {
        console.warn("Theme preference could not be read.", error);
    }

    applyTheme(savedTheme);
}

function handleKeyboardShortcuts(event) {
    const target = event.target;

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
    ) {
        return;
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPreviousQuestion();
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNextQuestion();
        return;
    }

    if (state.reviewMode || state.submitted) {
        return;
    }

    if (/^[1-9]$/.test(event.key)) {
        const optionIndex = Number(event.key) - 1;
        const question = examQuestions[state.currentQuestion];

        if (optionIndex < question.options.length) {
            event.preventDefault();
            selectAnswer(optionIndex);
        }

        return;
    }

    if (event.key.toLowerCase() === "c") {
        event.preventDefault();
        clearResponse();
        return;
    }

    if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        markForReviewAndNext();
        return;
    }

    if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        openSubmitModal();
    }
}

function bindEvents() {
    elements.prevBtn?.addEventListener("click", goToPreviousQuestion);
    elements.nextBtn?.addEventListener("click", goToNextQuestion);
    elements.clearBtn?.addEventListener("click", clearResponse);
    elements.markReviewBtn?.addEventListener("click", markForReviewAndNext);
    elements.submitBtn?.addEventListener("click", openSubmitModal);

    elements.confirmSubmitBtn?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        submitTest();
    });

    elements.reviewAnswersBtn?.addEventListener("click", reviewAnswers);

    elements.retakeBtn?.addEventListener("click", () => {
        clearSavedState();
        window.location.reload();
    });

    elements.instructionBtn?.addEventListener(
        "click",
        () => showModal(elements.instructionModal)
    );

    elements.paletteToggle?.addEventListener("click", togglePalette);

    bindModalCloseButtons();

    [elements.instructionModal, elements.submitModal].forEach(modal => {
        modal?.addEventListener("click", event => {
            if (event.target === modal) {
                hideModal(modal);
            }
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            if (elements.submitModal && !elements.submitModal.hidden) {
                hideModal(elements.submitModal);
                return;
            }

            if (
                elements.instructionModal &&
                !elements.instructionModal.hidden
            ) {
                hideModal(elements.instructionModal);
                return;
            }
        }

        handleKeyboardShortcuts(event);
    });

    window.addEventListener("beforeunload", saveState);
}

function applyExamConfiguration() {
    const platformName = CONFIG.platform?.name || "SHAGA TestHub";
    const motto = CONFIG.platform?.motto || "Learn Faster. Revise Smarter.";

    setText(elements.examTitle, EXAM_CONFIG.title || DEFAULT_CONFIG.exam.title);
    setText(document.getElementById("testName"), EXAM_CONFIG.subject || DEFAULT_CONFIG.exam.subject);
    setText(document.getElementById("sectionTab"), EXAM_CONFIG.sectionName || DEFAULT_CONFIG.exam.sectionName);
    setText(document.querySelector(".question-type"), EXAM_CONFIG.questionType || DEFAULT_CONFIG.exam.questionType);
    setText(document.getElementById("candidateName"), CONFIG.candidate?.defaultName || "Guest Candidate");

    const logoStrong = document.querySelector(".logo-text strong");
    const logoSmall = document.querySelector(".logo-text small");
    setText(logoStrong, platformName);
    setText(logoSmall, motto);

    const instructionList = elements.instructionModal?.querySelector("ol");
    if (instructionList && Array.isArray(CONFIG.instructions) && CONFIG.instructions.length) {
        instructionList.innerHTML = "";
        CONFIG.instructions.forEach(instruction => {
            const item = document.createElement("li");
            item.textContent = instruction;
            instructionList.appendChild(item);
        });
    }

    document.title = `${EXAM_CONFIG.title || DEFAULT_CONFIG.exam.title} | ${platformName}`;
}

function initialiseTest() {
    applyExamConfiguration();
    updateMetaInformation();
    // restoreState();
    initialiseThemeToggle();
    bindEvents();
    renderQuestion();

    if (state.totalTime <= 0) {
        submitTest();
    } else {
        startTimer();
    }
}

initialiseTest();
