document.addEventListener("click", () =>{
async function getQuizScores() {
  try {
    const quizIdContainer = document.querySelector(".quizId");
    const quizId = quizIdContainer.getAttribute("id");

    const response = await fetch(`/teachers/studentscores/${quizId}`);
    const data = await response.json();
    console.log(data.studentScores[0].quizScores[0].score);
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";

    data.studentScores.forEach((score) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      const scoreCell = document.createElement("td");

      nameCell.textContent = score.name;
      scoreCell.textContent = score.quizScores[0].score;

      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

getQuizScores();
});