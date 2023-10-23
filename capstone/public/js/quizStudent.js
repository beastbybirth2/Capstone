const API_LINK = "https://webar-um2g.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    function addQuizzes(quiz) {
        const quizQuestionsForm = document.getElementById("quizQuestionsForm");
        quiz.questions.forEach((question, index) => {
            const questionContainer = document.createElement("div");
            questionContainer.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p>${question.questionText}</p>
            <ul>
              ${question.options.map((option, optionIndex) => `
                <li>
                  <input type="radio" id="option${index}-${optionIndex}" name="answer${index}" value="${option}">
                  <label for="option${index}-${optionIndex}">${option}</label>
                </li>
              `).join("")}
            </ul>
          `;
            quizQuestionsForm.appendChild(questionContainer);
        });
    }

    function compileAnswers() {
        const answers = [];
        const questionContainers = quizQuestionsForm.getElementsByTagName("div");
        for (let i = 0; i < questionContainers.length; i++) {
            const questionContainer = questionContainers[i];
            const selectedOption = questionContainer.querySelector(`input[name="answer${i}"]:checked`);
            if (selectedOption) {
                answers.push(selectedOption.value);
            } else {
                answers.push(null);
            }
        }
        return answers;
    }

    function submitQuiz(submissionData){
        fetch(`${API_LINK}/students/submitquiz`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(submissionData)
        })
            .then(response => response.json())
            .then(data => {
                // Display the score or any other message received from the server
                console.log(data);
            })
            .catch(error => {
                console.error(error);
                alert("Failed to submit the quiz. Please try again.");
            });
    }
    document.getElementById("quizForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const quizId = document.getElementById("quizId").value;

        // Make a request to retrieve the quiz based on the entered ID
        fetch(`${API_LINK}/students/getQuiz/${quizId}`)
            .then(response => response.json())
            .then(quiz => {
                // Hide the quiz ID input form and show the quiz questions
                document.getElementById("quizContainer").style.display = "block";
                document.getElementById("quizForm").style.display = "none";

                // Generate the quiz questions dynamically
                addQuizzes(quiz);

                // Add event listener to the quiz questions form for submission
                quizQuestionsForm.addEventListener("submit", function (event) {
                    event.preventDefault();

                    // Collect the answers from the form
                    const answers = compileAnswers();

                    // Prepare the data to be submitted
                    const submissionData = {
                        quizId: quizId,
                        response: answers,
                    };

                    // Make a request to submit the quiz
                    submitQuiz(submissionData);
                });
            })
            .catch(error => {
                console.error(error);
                alert("Failed to retrieve the quiz. Please try again.");
            });
    });
});