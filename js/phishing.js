/* phishing.js */

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("Initializing page...");

//     // Check if we're on the phishing module page
//     if (document.body.classList.contains("phishing-module")) {
//         console.log("Phishing module detected. Running initializeModule().");
//         initializeModule();
//     } else {
//         console.log("Not on phishing module. Skipping initializeModule().");
//     }

//     // Start pre-quiz if on pre-quiz page
//     if (document.body.classList.contains("pre-quiz")) {
//         console.log("Pre-Quiz Page Loaded");
//         startQuiz(true);
//     }

//     // Start post-quiz if on post-quiz page
//     if (document.body.classList.contains("post-quiz")) {
//         console.log("Post-Quiz Page Loaded");
//         startQuiz(false);
//     }
// });

// Navigate to a different page
function navigateTo(url) {
    console.log("Navigating to:", url); 
    window.location.href = url;       
}

// Quiz Questions
const quizQuestions = [
    { imgSrc: "../../assets/images/phishing/quiz-examples/example1.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example2.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example3.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example4.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example5.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example6.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example7.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example8.png", correctAnswer: "legitimate" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example9.png", correctAnswer: "phishing" },
    { imgSrc: "../../assets/images/phishing/quiz-examples/example10.png", correctAnswer: "phishing" }
];

// Initialize Module Steps and Progress
// function initializeModule() {
//     const steps = document.querySelectorAll('.step');
//     const progressBar = document.getElementById('progress-bar');

//     // If pre-quiz has been completed, unlock full module
//     if (localStorage.getItem('preQuizComplete') === 'true') {
//         steps.forEach(step => {
//             step.style.opacity = 1;
//             step.style.pointerEvents = 'auto';
//         });

//         document.getElementById('pre-quiz-btn').disabled = true; // Disable pre-quiz button
//         document.getElementById('pre-quiz-btn').innerText = "Completed ✅";

//         progressBar.style.width = '50%'; // Set progress halfway
//     } else {
//         // Grey out everything except the pre-quiz
//         steps.forEach((step, index) => {
//             if (index === 0) {
//                 step.style.opacity = 1;
//                 step.style.pointerEvents = 'auto';
//             } else {
//                 step.style.opacity = 0.5;
//                 step.style.pointerEvents = 'none';
//             }
//         });
//     }
// }

// function initializeModule() {
//     console.log("Initializing module...");

//     const steps = document.querySelectorAll('.step');
//     const progressBar = document.getElementById('progress-bar');
//     const preQuizButton = document.getElementById('pre-quiz-btn');

//     // Ensure pre-quiz button exists before modifying it
//     if (preQuizButton) {
//         if (localStorage.getItem('preQuizComplete') === 'true') {
//             preQuizButton.disabled = true;
//             preQuizButton.innerText = "Completed ✅";
//         }
//     } else {
//         console.warn("pre-quiz-btn not found in DOM.");
//     }

//     // Ensure progress bar exists before modifying it
//     if (progressBar) {
//         let progress = localStorage.getItem('preQuizComplete') === 'true' ? 50 : 0;
//         progressBar.style.width = `${progress}%`;
//     } else {
//         console.warn("progress-bar not found in DOM.");
//     }

//     // Unlock full module if pre-quiz is completed
//     if (localStorage.getItem('preQuizComplete') === 'true') {
//         steps.forEach(step => {
//             step.style.opacity = 1;
//             step.style.pointerEvents = 'auto';
//         });
//     } else {
//         steps.forEach((step, index) => {
//             if (index === 0) {
//                 step.style.opacity = 1;
//                 step.style.pointerEvents = 'auto';
//             } else {
//                 step.style.opacity = 0.5;
//                 step.style.pointerEvents = 'none';
//             }
//         });
//     }
// }

// Quiz Logic
let currentQuestion = 0;
let score = 0;
let feedback = [];
let isPreQuiz = false;

// Start Quiz
function startQuiz(preQuiz) {
    console.log("startQuiz() called! Pre-Quiz Mode:", preQuiz);
    currentQuestion = 0;
    score = 0;
    feedback = [];
    isPreQuiz = preQuiz;
    loadQuestion(); 
}

// Load images for quizzes
function loadQuestion() {
    console.log("Loading question...");
    if (!quizQuestions[currentQuestion]) {
        console.error("Question not found at index:", currentQuestion);
        return;
    }

    const imgElement = document.getElementById("email-image");
    if (!imgElement) {
        console.error("Image element not found. Retrying in 500ms...");
        setTimeout(loadQuestion, 500);
        return;
    }

    console.log("Loading question:", currentQuestion, "Image:", quizQuestions[currentQuestion].imgSrc);
    imgElement.src = quizQuestions[currentQuestion].imgSrc;
    imgElement.alt = `Question ${currentQuestion + 1}`;
}


// Check Answer
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
        localStorage.setItem("preQuizResults", JSON.stringify(feedback));
        localStorage.setItem("preQuizScore", score.toString());
        document.getElementById("completion-message").style.display = "block";
        unlockModule();
    } else {
        const preQuizResults = JSON.parse(localStorage.getItem("preQuizResults")) || [];
        const feedbackContainer = document.getElementById("feedback-container");

        feedbackContainer.innerHTML = ""; // Clear previous content

        feedback.forEach((item, index) => {
            const preQuizResult = preQuizResults.find(q => q.questionId === item.questionId);
            
            let improvement;
            if (!preQuizResult) {
                improvement = "No previous data";
            } else if (!preQuizResult.correct && item.correct) {
                improvement = "Improved"; // Wrong in pre-quiz, right in post-quiz
            } else if (preQuizResult.correct && item.correct) {
                improvement = "Consistent"; // Right in both quizzes
            } else if (preQuizResult.correct && !item.correct) {
                improvement = "Regressed"; // Right in pre-quiz, wrong in post-quiz
            } else {
                improvement = "Still Incorrect"; // Wrong in both
            }

            // Create feedback item dynamically
            const feedbackItem = document.createElement("div");
            feedbackItem.className = `feedback-item ${item.correct ? "correct" : "incorrect"}`;

            // Create image element
            const imgElement = document.createElement("img");
            imgElement.className = "feedback-image";
            imgElement.src = item.imgSrc; // Set the correct source
            imgElement.alt = `Question ${index + 1}`;

            // Create text container
            const textContainer = document.createElement("div");
            textContainer.className = "feedback-text";

            textContainer.innerHTML = `
                <p class="question-text"><strong>Question ${index + 1}:</strong></p>
                <p class="answer-text">You answered <span style="color: ${item.correct ? '#4CAF50' : '#F44336'};">
                    ${item.correct ? "correctly" : "incorrectly"}</span>. 
                    The correct answer was <strong>${item.correctAnswer}</strong>.
                </p>
                <p class="improvement-text"><em>${improvement}</em></p>
            `;

            feedbackItem.appendChild(imgElement);
            feedbackItem.appendChild(textContainer);
            feedbackContainer.appendChild(feedbackItem);
        });

        document.getElementById("results").style.display = "block";

        const preQuizScore = parseInt(localStorage.getItem("preQuizScore") || "0");
        const improvement = score - preQuizScore;
        document.getElementById("score").innerText = `You got ${score} out of ${quizQuestions.length} correct! 
            ${improvement > 0 ? `Great job! You improved by ${improvement} point(s).` 
            : improvement === 0 ? "No improvement, but keep practicing!" 
            : "Scores decreased. Review the module for better understanding."}`;
    }
}

function showCompletionMessage() {
    document.getElementById("quiz-content").style.display = "none"; // Hide quiz
    const completionMessage = document.getElementById("completion-message");
    completionMessage.classList.remove("hidden"); // Make visible
    completionMessage.classList.add("show"); // Apply fade-in effect
}

// Unlock the full module after pre-quiz completion
function unlockModule() {
    localStorage.setItem('preQuizComplete', 'true');
    localStorage.setItem('preQuizScore', score);

    showCompletionMessage();
    //navigateTo('index.html');
}

// Reset the pre-quiz and previous score so you can access it again
function resetQuiz() {
    if (confirm("Are you sure you want to reset the Pre-Quiz? Your progress will be lost.")) {
        localStorage.removeItem("preQuizComplete");
        localStorage.removeItem("preQuizScore");
        localStorage.removeItem("preQuizResults"); // Clear pre-quiz answer data
        location.reload(); // Refresh the page to reflect changes
    }
}

