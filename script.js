// --- QUIZ DATA ---
const quizData = [
  {
    question: "Where are the 2026 Winter Olympics being held?",
    options: [
      "Beijing, China",
      "Vancouver, Canada",
      "Milan and Cortina d'Ampezzo, Italy",
      "Sapporo, Japan",
    ],
    correct: 2,
    fact: "Italy is hosting the Winter Games across two cities, featuring new exciting sports like ski mountaineering!",
  },
  {
    question:
      "The 2026 FIFA World Cup is making history by being co-hosted by which three countries?",
    options: [
      "Brazil, Argentina, Chile",
      "USA, Canada, Mexico",
      "Spain, Portugal, Morocco",
      "UK, Ireland, France",
    ],
    correct: 1,
    fact: "This is the first FIFA World Cup to feature an expanded format of 48 teams instead of the traditional 32.",
  },
  {
    question:
      "Which Indian state became the first to launch a Marine Spatial Plan (MSP) for integrated coastal management in 2026?",
    options: ["Kerala", "Odisha", "Gujarat", "Tamil Nadu"],
    correct: 1,
    fact: "Odisha launched this plan to carefully balance the economic use of its ocean resources with vital marine conservation.",
  },
  {
    question:
      "ISRO successfully launched the EOS-N1 satellite in early 2026. Which rocket was used for this mission?",
    options: ["GSLV Mk III", "LVM3", "SSLV-D3", "PSLV-C62"],
    correct: 3,
    fact: "The PSLV-C62 mission successfully carried 15 co-passenger satellites into orbit alongside the main payload.",
  },
  {
    question:
      "The 2026 Commonwealth Games have been scaled down and will be hosted in which city?",
    options: [
      "Glasgow, Scotland",
      "Gold Coast, Australia",
      "New Delhi, India",
      "Birmingham, England",
    ],
    correct: 0,
    fact: "To reduce costs, Glasgow is hosting a highly streamlined version of the games featuring only 10 sports.",
  },
  {
    question:
      "Which region's comprehensive 'AI Act' governance framework officially went into full regulatory effect in 2026?",
    options: ["United States", "China", "European Union", "India"],
    correct: 2,
    fact: "The EU's AI Act is the world's first comprehensive legal framework for artificial intelligence, categorizing AI by risk levels.",
  },
  {
    question:
      "Which two nations are co-hosting the 2026 ICC Men's T20 World Cup?",
    options: [
      "Australia & New Zealand",
      "India & Sri Lanka",
      "West Indies & USA",
      "England & Wales",
    ],
    correct: 1,
    fact: "India and Sri Lanka are teaming up to host 20 international teams battling it out in the T20 format.",
  },
];

// --- DOM ELEMENTS ---
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const optionsGrid = document.getElementById("options-grid");
const questionTracker = document.getElementById("question-tracker");
const progressFill = document.getElementById("progress-fill");
const timerElement = document.getElementById("timer");
const factBox = document.getElementById("fact-box");
const factText = document.getElementById("fact-text");

// --- GAME VARIABLES ---
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval;

// --- EVENT LISTENERS ---
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", loadNextQuestion);
restartBtn.addEventListener("click", startQuiz);

// --- FUNCTIONS ---
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  startScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  quizScreen.classList.add("active");
  loadQuestion();
}

function loadQuestion() {
  // Reset UI for new question
  resetState();

  const currentQuizData = quizData[currentQuestionIndex];
  questionText.innerText = currentQuizData.question;
  questionTracker.innerText = `Question ${currentQuestionIndex + 1}/${quizData.length}`;

  // Update Progress Bar
  const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
  progressFill.style.width = `${progressPercentage}%`;

  // Generate option buttons
  currentQuizData.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.innerText = option;
    button.classList.add("option-btn");
    button.dataset.index = index;
    button.addEventListener("click", selectAnswer);
    optionsGrid.appendChild(button);
  });

  startTimer();
}

function resetState() {
  clearInterval(timerInterval);
  nextBtn.classList.add("hide");
  factBox.classList.add("hide");
  optionsGrid.innerHTML = "";
  timeLeft = 15;
  timerElement.innerText = timeLeft;
  timerElement.parentElement.style.borderColor = "#ff3366";
  timerElement.style.color = "#ff3366";
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.innerText = timeLeft;

    // Visual warning when time is low
    if (timeLeft <= 5) {
      timerElement.parentElement.style.borderColor = "#ff0000";
      timerElement.style.color = "#ff0000";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function selectAnswer(e) {
  clearInterval(timerInterval);
  const selectedBtn = e.target;
  const selectedIndex = parseInt(selectedBtn.dataset.index);
  const correctIndex = quizData[currentQuestionIndex].correct;

  checkAnswer(selectedBtn, selectedIndex, correctIndex);
}

function handleTimeout() {
  const correctIndex = quizData[currentQuestionIndex].correct;
  // Find the correct button and highlight it, but don't give points
  Array.from(optionsGrid.children).forEach((btn) => {
    if (parseInt(btn.dataset.index) === correctIndex) {
      btn.classList.add("correct");
    }
    btn.disabled = true;
  });
  showFact();
}

function checkAnswer(selectedBtn, selectedIndex, correctIndex) {
  // Disable all buttons
  Array.from(optionsGrid.children).forEach((btn) => (btn.disabled = true));

  if (selectedIndex === correctIndex) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("wrong");
    // Highlight the correct answer too
    Array.from(optionsGrid.children).forEach((btn) => {
      if (parseInt(btn.dataset.index) === correctIndex) {
        btn.classList.add("correct");
      }
    });
  }

  showFact();
}

function showFact() {
  const currentQuizData = quizData[currentQuestionIndex];
  factText.innerText = currentQuizData.fact;
  factBox.classList.remove("hide");
  nextBtn.classList.remove("hide");
}

function loadNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  document.getElementById("score-text").innerText = score;
  document.getElementById("total-text").innerText = quizData.length;

  const resultMessage = document.getElementById("result-message");
  if (score === quizData.length) {
    resultMessage.innerText = "Flawless! You're a 2026 Mastermind. 🏆";
  } else if (score >= quizData.length / 2) {
    resultMessage.innerText = "Great job! You know your stuff. 👏";
  } else {
    resultMessage.innerText = "Time to catch up on the news! 📰";
  }
}
