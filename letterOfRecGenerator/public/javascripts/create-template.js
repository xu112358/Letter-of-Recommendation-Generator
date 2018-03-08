var nextQuestionIdToUse = 0;
var id;

/**
 * Prototype class for Questions
 */
class Question {
    constructor(type, value, tag) {
        // text, radio, checkbox
        this.type = type;
        this.value = value;
        this.tag = tag;
        // local browser
        this.id = nextQuestionIdToUse;
        // filled with strings if dealing with radio button or checkbox
        this.options = [];
        nextQuestionIdToUse++;
    }
}

const LETTER_TEXT_AREA_ID = "letter-text-area";
const QUESTIONS_CONTAINER_ID = "questions-container";
const ADD_QUESTION_MODAL_ID = "add-question-modal";
const WARNING_MODAL_ID = "warning-modal";

let letter = "";
var questions = [];
var warningModalFunction;

window.onload = function () {
    setUpEventHandlers();
    loadDefaultQuestions();
    displayQuestions();
}

function loadDefaultQuestions() {
    var default1 = new Question("Text", "What is your name?", "name");
    questions.push(default1);
    var default2 = new Question("Radio", "What is your gender?", "");
    default2.options = ["Male", "Female", "Prefer not to answer"];
    questions.push(default2);
}

function setUpEventHandlers() {
    // upload letterhead
    $('#letterhead-upload').submit(function(evt) {
        evt.preventDefault();
        var files = $('#letterhead-upload-file')[0].files;
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#letterhead-preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(files[0]);
        }

        // I'm leaving this code here as it is potentially useful for uploading to backend
        // it sends a post request with the data to 'fileUpload' path
        //
        // var formData = new FormData($(this)[0]);
        // $.ajax({
        //     url: 'fileUpload',
        //     type: 'POST',
        //     data: formData,
        //     async: false,
        //     cache: false,
        //     contentType: false,
        //     enctype: 'multipart/form-data',
        //     processData: false,
        //     success: function (response) {
        //     alert(response);
        //     }
        // });

        // disable page refresh
        return false;
    });
}

window.onclick = function (event) {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    if (event.target == modal) {
        hideAddQuestionModal();
    }
}

function displayQuestions() {
    // grab the container that will hold all questions
    var container = document.getElementById(QUESTIONS_CONTAINER_ID);

    // fill in with questions
    container.innerHTML = "";
    for (var i = 0; i < questions.length; i++) {
        container.innerHTML += getQuestionHTML(questions[i]);
    }
}

function getQuestionHTML(q) {
    var data_id_attribute = "data-id=\"" + q.id + "\"";
    var delete_onclick_attribute = "onclick=\"deleteQuestionWithWarning(" + q.id + ")\"";
    var multiple_choice_fields_html = getMultipleChoiceFieldsHTML(q);
    var placeholder = "Enter new question here...";

    var question_type_label = "";
    switch (q.type) {
        case "Text":
            question_type_label = "TEXT";
            break;
        case "Radio":
            question_type_label = "RADIO BUTTON";
            break;
        case "Checkbox":
            question_type_label = "CHECKBOX";
            break;
        default:
            break;
    }

    return "<h2>" + question_type_label + "</h2>" +
            "<div class=\"question-outer-container\"" + data_id_attribute + ">" +
                "<div class=\"question-container\">" +
                    getTextAreaHTML(placeholder, q.value) +
                    multiple_choice_fields_html +
                    "<span class=\"line\"></span>" +
                    "<input data-type=\"tag\" class=\"text-field blue-text\" type=\"text\" placeholder=\"Enter answer tag here... (optional)\" value=\"" +
                    q.tag + "\">" +
                "</div>" +
                "<button class=\"question-button small-circle-button\" " + delete_onclick_attribute + ">X</button>" +
            "</div>";
}

// Note: the html needs to be nested within a question-container element in order to properly work
function getMultipleChoiceFieldsHTML(q) {
    if (q.type != "Radio" && q.type != "Checkbox") return "";

    var placeholder = "Enter option here...";
    var html = "<div class=\"multiple-choices-container\">";
    for (var i = 0; i < q.options.length; i++) {
        var data_id_attribute = "data-id=\"" + i + "\"";
        var delete_onclick_attribute = "onclick=\"deleteMultipleChoiceFieldWithWarning(this," + i + ")\"";
        html += "<div class=\"multiple-choice-container\"" + data_id_attribute + ">" +
                    getTextAreaHTML(placeholder, q.options[i]) +
                    "<button class=\"question-button small-circle-button\" " + delete_onclick_attribute + ">X</button>" +
                "</div>";
    }
    var add_multiple_choice_attribute = "onclick=\"addMultipleChoiceField(" + q.id + ")\"";
    html += "<button class=\"small-circle-button\" " + add_multiple_choice_attribute + ">+</button>";
    html += "</div>";
    return html;
}

function getTextAreaHTML(placeholder, value) {
    return "<textarea data-type=\"value\" class=\"text-area\" type=\"text\" placeholder=\"" + placeholder + "\" onkeyup=\"auto_grow(this)\">" +
            value + "</textarea>";
}

// used for allowing text areas to grow in height (trick with onkeyup)
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
}

function addQuestion() {
    console.log("addQuestion called");
    showAddQuestionModal();
}

function saveTemplate() {
    console.log("saveTemplate called");
    updateQuestions();

    var template = {
        name: 'test',
        text: 'test',
        questions: getQuestions(),
        archived: false
    };


    if (id) {
        console.log("updating template");
        $.ajax({
            url: 'http://localhost:3000/create-template/update',
            data: {
                id: id,
                template: template
            },
            type: 'POST',
            complete: function () {
                console.log('complete');
            },
            success: function (data) {
                console.log(data);

                console.log('success');
            },
            error: function () {
                console.log('error');
            }
        });
    } else {
        console.log("creating template");
        $.ajax({
            url: 'http://localhost:3000/create-template/create',
            data: {template: template},
            type: 'POST',
            complete: function () {
                console.log('complete');
            },
            success: function (data) {
                console.log(data);

                id = data.id;

                console.log('success');
            },
            error: function () {
                console.log('error');
            }
        });
    }
}

function getQuestions() {
    var dbQuestions = [];
    var questionNumber = 1;

    questions.forEach(question => dbQuestions.push({
        number: questionNumber++,
        type: question.type,
        question: question.value,
        tag: question.tag,
        options: question.options
    }));

    return dbQuestions;
}

function showAddQuestionModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "block";
}

function hideAddQuestionModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

function showWarningModal(func) {
    var modal = document.getElementById(WARNING_MODAL_ID);
    modal.style.display = "block";
    warningModalFunction = func;
}

function hideWarningModal() {
    var modal = document.getElementById(WARNING_MODAL_ID);
    modal.style.display = "none";
}

function executeWarningModalFunction() {
    warningModalFunction();
    hideWarningModal();
}

// NOTE: need to push new question AFTER updateQuestions(), since display questions relies on a question being displayed once
// to assign it a data_id
function addTextAnswerQuestion() {
    console.log("addTestAnswerQuestion called");
    updateQuestions();
    questions.push(new Question("Text", "", ""));
    displayQuestions();
    hideAddQuestionModal();
}

function addRadioButtonQuestion() {
    console.log("addRadioButtonQuestion called");
    updateQuestions();
    var question = new Question("Radio", "", "");
    question.options.push("");
    questions.push(question);
    displayQuestions();
    hideAddQuestionModal();
}

function addCheckboxQuestion() {
    console.log("addCheckboxQuestion called");
    updateQuestions();
    var question = new Question("Checkbox", "", "");
    question.options.push("");
    questions.push(question);
    displayQuestions();
    hideAddQuestionModal();
}

function updateQuestions() {
    // update the letter
    letter = document.getElementById(LETTER_TEXT_AREA_ID).value;

    // update individual questions
    for (var i = 0; i < questions.length; i++) {
        // grab the question element
        var query = "div[data-id='" + questions[i].id + "'][class='question-outer-container']";
        var question = document.querySelector(query);

        questions[i].value = question.querySelector("[data-type='value']").value;
        questions[i].tag = question.querySelector("[data-type='tag']").value;

        var multipleChoices = question.querySelectorAll("[class='multiple-choice-container'");
        for (var j = 0; j < multipleChoices.length; j++) {
            questions[i].options[j] = multipleChoices[j].querySelector("[data-type='value']").value;
        }
    }
}

function deleteQuestion(id) {
    updateQuestions();
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].id == id) {
            questions.splice(i, 1);
            break;
        }
    }
    displayQuestions();
}

function deleteQuestionWithWarning(id) {
    showWarningModal(() => {
        deleteQuestion(id);
    });
}

function deleteMultipleChoiceFieldWithWarning(el, data_id) {
    showWarningModal(() => {
        deleteMultipleChoiceField(el, data_id);
    })
}

function addMultipleChoiceField(id) {
    var question = getQuestionById(id);
    question.options.push("");
    updateQuestions();
    displayQuestions();
}

function getQuestionById(id) {
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].id == id) {
            return questions[i];
        }
    }
    return null;
}

// needs the element as well as the data_id of the multiple choice field
function deleteMultipleChoiceField(el, data_id) {
    updateQuestions();

    var questionEl = findAncestor(el, 'question-outer-container');
    var question_data_id = questionEl.getAttribute('data-id');

    var question = getQuestionById(parseInt(question_data_id));
    question.options.splice(parseInt(data_id), 1);
    displayQuestions();
}

function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}
