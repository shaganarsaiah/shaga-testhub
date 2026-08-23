const repository = {

    subjects: {

        "Educational Psychology": [
            "Growth and Development",
            "Learning",
            "Memory",
            "Motivation",
            "Intelligence",
            "Personality & Adjustment",
            "Creativity & Thinking",
            "Psychological Testing",
            "Individual Differences",
            "Guidance and Counselling"
        ],

        "Educational Philosophy": [
            "Historical Perspective",
            "Religious Implications",
            "Epistemological Foundations",
            "Educational Thinkers",
            "Education and Values"
        ],

        "Educational Sociology": [
            "Education and Society",
            "Social Change and Education"
        ],

        "Educational Technology": [],

        "Educational Leadership": [],

        "Educational Management": [],

        "Assessment": [],
        

        "Teacher Education": [
            "Teacher Autonomy, Accountability and Responsibility"
        ],
        
        "Environmental Education": [
            "Sustainable Development and Environmental Education",
        ],
        
        "Economics of Education": [
            "Basics in Economics of Education and Educational Finance",
     ],


        "General Studies": []

    }

};


const subjectsContainer =
    document.getElementById("subjects");

const topicsContainer =
    document.getElementById("topics");


function getSelectedSubjects() {

    return Array.from(
        subjectsContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
    ).map(cb => cb.value);

}


function getSelectedTopics() {

    return Array.from(
        topicsContainer.querySelectorAll(
            'input[type="checkbox"]:checked'
        )
    ).map(cb => cb.value);

}


function loadTopics() {

    const previouslySelected =
        new Set(getSelectedTopics());

    topicsContainer.innerHTML = "";

    const selectedSubjects =
        getSelectedSubjects();

    const allTopics = [];


    selectedSubjects.forEach(subject => {

        const subjectTopics =
            repository.subjects[subject] || [];

        subjectTopics.forEach(topicName => {

            if (!allTopics.includes(topicName)) {

                allTopics.push(topicName);

            }

        });

    });


    if (allTopics.length === 0) {

        topicsContainer.innerHTML =
            "<small>No topics available for the selected subject(s).</small>";

        return;

    }


    allTopics.forEach(topicName => {

        const label =
            document.createElement("label");

        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = topicName;

        /*
         * Preserve previously selected topics.
         * If loading for the first time,
         * leave topics available for manual selection.
         */
        if (previouslySelected.has(topicName)) {
            checkbox.checked = true;
        }

        label.appendChild(checkbox);

        label.appendChild(
            document.createTextNode(
                " " + topicName
            )
        );

        topicsContainer.appendChild(label);

    });

}


subjectsContainer
    .querySelectorAll(
        'input[type="checkbox"]'
    )
    .forEach(cb => {

        cb.addEventListener(
            "change",
            loadTopics
        );

    });


loadTopics();


const startBtn =
    document.getElementById("startBtn");


startBtn.addEventListener(
    "click",
    async () => {

        const selectedSubjects =
            getSelectedSubjects();

        const selectedTopics =
            getSelectedTopics();


        if (selectedSubjects.length === 0) {

            alert(
                "Please select at least one subject."
            );

            return;

        }


        if (selectedTopics.length === 0) {

            alert(
                "Please select at least one topic."
            );

            return;

        }


        const config = {

            subjects: selectedSubjects,

            /*
             * NEW:
             * multiple topics
             */
            topics: selectedTopics,

            /*
             * Backward compatibility
             * with older TestHub code.
             */
            topic: selectedTopics[0] || "",

            questionCount: parseInt(
                document
                    .getElementById("questions")
                    .value
            ),

            difficulty:
                document
                    .getElementById("difficulty")
                    .value,

            language:
                document
                    .getElementById("language")
                    .value,

            time: parseInt(
                document
                    .getElementById("time")
                    .value
            )

        };


        localStorage.setItem(
    "testConfig",
    JSON.stringify(config)
);

window.location.href = "index.html";

});
