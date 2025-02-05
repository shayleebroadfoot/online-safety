/* phishing.js */

function navigateTo(url) {
    console.log("Navigating to:", url); 
    window.location.href = url;       
}

// Quiz Questions
const quizQuestions = [
    { imgSrc: "../../assets/images/phishing/pre-quiz/example1.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example2.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example3.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example4.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example5.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example6.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example7.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example8.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example9.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/pre-quiz/example10.png", correctAnswer: "phishing" }
];

// Module Navigation Logic
let currentStep = 0;
const steps = document.querySelectorAll(".step");
const progressBar = document.getElementById("progress-bar");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");

// Show the next step
function nextStep() {
    const steps = document.querySelectorAll(".step");
    steps[currentStep].classList.remove("active");

    if (currentStep < steps.length - 1) {
        currentStep++;
        steps[currentStep].classList.add("active");
    }

    updateProgressBar();
}

// Update the progress bar
function updateProgressBar() {
    const steps = document.querySelectorAll(".step");
    const progressBar = document.getElementById("progress-bar");
    const progress = ((currentStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Show a popup
function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupText = document.getElementById("popup-text");
    popupText.innerText = message;
    popup.classList.remove("hidden");
}

// Close the popup
function closePopup() {
    const popup = document.getElementById("popup");
    popup.classList.add("hidden");
}

// Initialize the module
window.onload = function () {
    updateProgressBar();
};

// Quiz Logic
let currentQuestion = 0;
let score = 0;
let feedback = [];
let isPreQuiz = false;

// Initialize the quiz
function startQuiz(preQuiz) {
    currentQuestion = 0;
    score = 0;
    feedback = [];
    isPreQuiz = preQuiz;
    loadQuestion();
}

// Load the current quiz question
function loadQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById("email-image").src = question.imgSrc;

    // Clear feedback for post-quiz
    if (!isPreQuiz) {
        document.getElementById("question-feedback").innerText = "";
    }
}

// Check the user's answer
function checkAnswer(answer) {
    const question = quizQuestions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;

    feedback.push({
        questionId: currentQuestion,
        imgSrc: question.imgSrc,
        correct: isCorrect,
        correctAnswer: question.correctAnswer
    });

    if (isCorrect) {
        score++;
    }

    if (!isPreQuiz) {
        // Show feedback in the post-quiz
        const feedbackMessage = isCorrect
            ? "Correct! You identified this email correctly."
            : `Incorrect. The correct answer was "${question.correctAnswer}".`;
        document.getElementById("question-feedback").innerText = feedbackMessage;
    }

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        showResults();
    }
}

// Show quiz results
function showResults() {
    document.querySelector("#quiz-content").style.display = "none";

    if (isPreQuiz) {
        // Save pre-quiz results
        localStorage.setItem("preQuizResults", JSON.stringify(feedback));
        localStorage.setItem("preQuizScore", score);

        // Show completion message
        document.getElementById("completion-message").style.display = "block";
    } else {
        // Compare post-quiz with pre-quiz results
        const preQuizResults = JSON.parse(localStorage.getItem("preQuizResults"));
        const resultsContainer = document.querySelector("#results");
        const feedbackList = document.getElementById("feedback");

        feedback.forEach((item, index) => {
            const preQuizResult = preQuizResults.find(q => q.questionId === item.questionId);
            const improvement = preQuizResult
                ? item.correct && !preQuizResult.correct
                    ? "Improved"
                    : item.correct && preQuizResult.correct
                    ? "Consistent"
                    : "Still Incorrect"
                : "New Question";

            const feedbackItem = document.createElement("li");
            feedbackItem.className = item.correct ? "correct" : "incorrect";
            feedbackItem.innerHTML = `
                <img src="${item.imgSrc}" alt="Question ${index + 1}">
                <p>
                    <strong>Question ${index + 1}:</strong> 
                    You answered <span style="color: ${item.correct ? '#4CAF50' : '#F44336'};">
                    ${item.correct ? "correctly" : "incorrectly"}</span>. 
                    The correct answer was <strong>${item.correctAnswer}</strong>.
                    <br><em>${improvement}</em>
                </p>
            `;
            feedbackList.appendChild(feedbackItem);
        });

        resultsContainer.style.display = "block";

        // Show improvement message
        const preQuizScore = localStorage.getItem("preQuizScore");
        const improvement = score - preQuizScore;
        document.getElementById("score").innerText = `You got ${score} out of ${quizQuestions.length} correct! ${improvement > 0 ? `Great job! You improved by ${improvement} point(s).` : improvement === 0 ? "No improvement, but keep practicing!" : "Scores decreased. Review the module for better understanding."}`;
    }
}

// Navigate back to the module
function goToModule() {
    window.location.href = "index.html";
}

// Initialize quiz or module on page load
window.onload = function () {
    const isPreQuizPage = document.body.classList.contains("pre-quiz");
    if (isPreQuizPage || document.body.classList.contains("post-quiz")) {
        startQuiz(isPreQuizPage);
    }
};
