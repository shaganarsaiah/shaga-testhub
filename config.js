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

const subject = document.getElementById("subject");

const topic = document.getElementById("topic");

function loadTopics() {

    topic.innerHTML = "";

    const topics = repository.subjects[subject.value];

    topics.forEach(t => {

        const option = document.createElement("option");

        option.textContent = t;

        option.value = t;

        topic.appendChild(option);

    });

}

subject.addEventListener("change", loadTopics);

loadTopics();

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", async () => {

    const config = {

        subject: document.getElementById("subject").value,
        topic: document.getElementById("topic").value,
        questionCount: parseInt(document.getElementById("questions").value),
        difficulty: document.getElementById("difficulty").value,
        language: document.getElementById("language").value,
        time: parseInt(document.getElementById("time").value)

    };

    localStorage.setItem("testConfig", JSON.stringify(config));

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