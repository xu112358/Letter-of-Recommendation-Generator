
/**
 * Prototype class for Questions
 */
class Question {
    constructor() {

    }
}

const QUESTIONS_CONTAINER_ID = "questions-container";
var questions = [];

window.onload = function() {

}

function displayQuestions() {
    // grab the container that will hold all questions
    var container = document.getElementById(QUESTIONS_CONTAINER_ID);

    // fill in with questions
    container.innerHTML = "";
    for (var i = 0; i < questions.length; i++) {

    }
}

// used for allowing textareas to grow in height (trick with onkeyup)
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}

function addQuestion() {
    console.log("addQuestion called");
}

function saveTemplate() {
    console.log("saveTemplate called");
}