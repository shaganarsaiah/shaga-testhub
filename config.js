const repository = {

    subjects: {

        "Educational Psychology": [
            "Growth and Development",
            "Learning"
        ],

        "Educational Philosophy": [
            "Idealism"
        ],

        "Educational Sociology": [],

        "Educational Technology": [],

        "Educational Leadership": [],

        "Educational Management": [],

        "Assessment": [],

        "Teacher Education": [],

        "General Studies": []

    }

};

const subjectsContainer = document.getElementById("subjects");
const topic = document.getElementById("topic");

function getSelectedSubjects() {

    return Array.from(
        subjectsContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
    ).map(cb => cb.value);

}

function loadTopics() {

    topic.innerHTML = "";

    const selectedSubjects = getSelectedSubjects();

    const allTopics = [];

    selectedSubjects.forEach(subject => {

        const topics = repository.subjects[subject] || [];

        topics.forEach(t => {

            if (!allTopics.includes(t)) {

                allTopics.push(t);

            }

        });

    });

    allTopics.forEach(t => {

        const option = document.createElement("option");

        option.textContent = t;

        option.value = t;

        topic.appendChild(option);

    });

}

subjectsContainer
.querySelectorAll('input[type="checkbox"]')
.forEach(cb => {

    cb.addEventListener("change", loadTopics);

});

loadTopics();

const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", async () => {

    const config = {

        subjects: getSelectedSubjects(),

        topic: topic.value,

        questionCount: parseInt(
            document.getElementById("questions").value
        ),

        difficulty: document.getElementById("difficulty").value,

        language: document.getElementById("language").value,

        time: parseInt(
            document.getElementById("time").value
        )

    };

    localStorage.setItem(
        "testConfig",
        JSON.stringify(config)
    );

    try {

        const response = await fetch("/generate-test", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(config)

        });

        const result = await response.json();

        if (result.success) {

            window.location.href = "index.html";

        } else {

            alert("Test generation failed.");

        }

    } catch (err) {

        console.error(err);

        alert("Server not running.");

    }

});