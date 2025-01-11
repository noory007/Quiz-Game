// Most used variables
let currentQuestion = 0;
let score = 0;
let questions = [];

// I made varriables that i got through "id"
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const submitBtn = document.getElementById("submit");
const quizEl = document.getElementById("quiz");
const resultsEl = document.getElementById("results");
const scoreEl = document.getElementById("score");
const currentQuestionEl = document.getElementById("current");
const totalQuestionsEl = document.getElementById("total");

//  I Fetch the API
async function fetchQuestions() {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    );
    const data = await response.json();
    questions = data.results;
    totalQuestionsEl.textContent = questions.length;
    loadQuestion();
  } catch (error) {
    console.error("Error fetching questions:", error);
    questionEl.textContent = "Error loading questions. Please try again later.";
  }
}

// You can see question and choices which are loaded
function loadQuestion() {
  const question = questions[currentQuestion];
  questionEl.innerHTML = question.question;

  // Clear the previous data information
  choicesEl.innerHTML = "";

  // You can see correct and incorrect answers
  const choices = [...question.incorrect_answers, question.correct_answer];

  shuffleArray(choices);

  // Create buttons for each choice
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.innerHTML = choice;
    button.addEventListener("click", () => selectChoice(button));
    choicesEl.appendChild(button);
  });

  currentQuestionEl.textContent = currentQuestion + 1;
  submitBtn.style.display = "none";
}

// choice selection
function selectChoice(selected) {
  choicesEl.querySelectorAll("button").forEach((button) => {
    button.classList.remove("selected");
  });

  // Add 'selected' class to clicked button
  selected.classList.add("selected");
  submitBtn.style.display = "block";
}

// You can see answer submission
function submitAnswer() {
  const selected = choicesEl.querySelector(".selected");
  if (!selected) return;

  const answer = selected.innerHTML;
  const question = questions[currentQuestion];

  if (answer === question.correct_answer) {
    score++;
    selected.style.backgroundColor = "green";
  } else {
    selected.style.backgroundColor = "red";
    choicesEl.querySelectorAll("button").forEach((button) => {
      if (button.innerHTML === question.correct_answer) {
        button.style.backgroundColor = "green";
      }
    });
  }

  choicesEl.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });

  currentQuestion++;

  if (currentQuestion < questions.length) {
    setTimeout(loadQuestion, 1500);
  } else {
    setTimeout(showResults, 1500);
  }
}

// We can see final results
function showResults() {
  quizEl.style.display = "none";
  resultsEl.style.display = "block";
  scoreEl.textContent = `${score} out of ${questions.length}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Event listeners
submitBtn.addEventListener("click", submitAnswer);

// Start the quiz
fetchQuestions();
