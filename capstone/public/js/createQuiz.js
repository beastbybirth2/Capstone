document.addEventListener("DOMContentLoaded", () => {
  //createQuiz components
  const createQuizForm = document.getElementById("createQuizForm");
  const addQuestionButton = document.getElementById("addQuestion");
  const questionsContainer = document.getElementById("questionsContainer");

  //getQuiz components
  const quizlist = document.querySelector(".quizList");

  let questionCounter = 0;

  const API_LINK = "https://webar-um2g.onrender.com";

  addQuestionButton.addEventListener("click", () => {
    questionCounter++;

    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = `
        <label>Question ${questionCounter}:</label><br>
        <input type="text" name="questions[${questionCounter}]questionText" placeholder="Question text" required><br>
        <input type="text" name="questions[${questionCounter}]options" placeholder="Option 1" required>
        <input type="text" name="questions[${questionCounter}]options" placeholder="Option 2" required>
        <input type="text" name="questions[${questionCounter}]options" placeholder="Option 3" required>
        <input type="text" name="questions[${questionCounter}]options" placeholder="Option 4" required>
        <label>Correct Option:</label>
        <select name="questions[${questionCounter}]correctOptionIndex">
          <option value="0">Option 1</option>
          <option value="1">Option 2</option>
          <option value="2">Option 3</option>
          <option value="3">Option 4</option>
        </select><br><br>
      `;
    questionsContainer.appendChild(questionDiv);
  });

  createQuizForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const requestData = compileQuestions();
    console.log(requestData);
    postQuiz(requestData);
  });

  function compileQuestions() {
    const formData = new FormData(createQuizForm);
    const requestData = {
      title: formData.get("title"),
      questions: [],
    };

    for (let i = 0; i <= questionCounter; i++) {
      const question = {
        questionText: formData.get(`questions[${i}]questionText`),
        options: [],
        correctOptionIndex: Number(formData.get(`questions[${i}]correctOptionIndex`)),
      };
      const options = formData.getAll(`questions[${i}]options`);
      question.options = options;
      requestData.questions.push(question);
    }
    return requestData;
  }
  async function postQuiz(requestData) {
    try {
      const response = await fetch(`${API_LINK}/teachers/createquiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();
      console.log(responseData);

      if (response.ok) {
        alert("Quiz created successfully!");
        createQuizForm.reset();
        questionCounter = 0;
        questionsContainer.innerHTML = "";
      } else {
        alert("Failed to create quiz. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  }

  function addQuiz(title, code) {
    const cardContent = document.createElement("div");
    cardContent.classList.add("cardContent");
    cardContent.setAttribute("id", code);
    cardContent.innerHTML = `
        <h3 class="cardTitle">${title}</h3>
        <p class="code">Code:${code}</p>
        <button class="viewResult">View Result</button>
        `;
    cardContent.querySelector(".viewResult").addEventListener("click", async () => {
      window.location.href = `/teachers/getscores/${code}`;
      console.log(id);
    })
    quizlist.appendChild(cardContent);
  };

  async function getQuiz(requestData) {
    try {
      const response = await fetch(`${API_LINK}/teachers/getquiz`);
      const quizzes = await response.json();
      console.log(quizzes);
      quizzes.forEach((quiz) => {
        addQuiz(quiz.title, quiz._id);
        console.log(quiz._id);
      });
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  }

  getQuiz();
});
