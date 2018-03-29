var nextQuestionIdToUse = 0;
var id = parseAttribute('id');
var imgData = parseAttribute('imgData');

/**
 * Prototype class for Questions
 */
class Question {
    constructor(type, value, tag) {
        // Text, Radio Button, Checkbox
        this.type = type;
        this.value = value;
        this.tag = tag;
        // local browser
        this.id = nextQuestionIdToUse;
        // Filled with Objects of {option, fill} (both strings) if dealing with Radio Button or Checkbox
        this.options = [];
        nextQuestionIdToUse++;
    }
}

const NAME_CONTAINER_TEXT_FIELD_ID = "name-container-text-field";
const LETTER_TEXT_AREA_ID = "letter-text-area";
const QUESTIONS_CONTAINER_ID = "questions-container";
const ADD_QUESTION_MODAL_ID = "add-question-modal";
const WARNING_MODAL_ID = "warning-modal";

let letter = "";
var questions = [];
var warningModalFunction;

window.onload = function () {
    setUpEventHandlers();

    if (id) {
        $.ajax({
            url: 'http://localhost:3000/template-editor/template',
            data: {id},
            type: 'GET',
            success: function (data) {
                document.getElementById(LETTER_TEXT_AREA_ID).value = data.letter;
                data.questions.forEach(question => {
                    var savedQuestion = new Question(question.type, question.question, question.tag);
                    savedQuestion.options = question.options;
                    questions.push(savedQuestion);
                });
                console.log('success');
                displayQuestions();
            },
            error: function () {
                console.log('error');
            }
        });
    } else {
        loadDefaultQuestions();
        displayQuestions();
    }
};

function loadDefaultQuestions() {
    var default1 = new Question("Text", "What is your name?", "<!NAME>");
    questions.push(default1);
    var default2 = new Question("Radio Button", "What is your preferred personal pronoun?", "<!GENDER>");
    default2.options = [constructOptionObject("He", "he"), constructOptionObject("She", "she"), constructOptionObject("They", "they")];
    var default2 = new Question("Radio Button", "What is your preferred possessive pronoun?", "<!GENDER>");
    default2.options = [constructOptionObject("His", "his"), constructOptionObject("Her", "her"), constructOptionObject("Their", "their")];
    questions.push(default2);
}

function setUpEventHandlers() {
    // upload letterhead
    $('#letterhead-upload').submit(function (evt) {
        evt.preventDefault();
        var files = $('#letterhead-upload-file')[0].files;
        if (files && files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#letterhead-preview').attr('src', e.target.result);
                imgData = e.target.result;
            };

            reader.readAsDataURL(files[0]);
        }

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
        case "Radio Button":
            question_type_label = "RADIO BUTTON";
            break;
        case "Checkbox":
            question_type_label = "CHECKBOX";
            break;
        default:
            break;
    }

    return "<h2>" + question_type_label + "</h2>" + "<div class=\"question-outer-container\"" + data_id_attribute + ">" + "<div class=\"question-container\">" + getTextAreaHTML(placeholder, q.value) + multiple_choice_fields_html + "<span class=\"line\"></span>" + "<input data-type=\"tag\" class=\"text-field blue-text\" type=\"text\" placeholder=\"Enter answer tag here... (optional)\" value=\"" + q.tag + "\">" + "</div>" + "<button class=\"question-button small-circle-button\" " + delete_onclick_attribute + ">X</button>" + "</div>";
}

// Note: the html needs to be nested within a question-container element in order to properly work
function getMultipleChoiceFieldsHTML(q) {
    if (q.type != "Radio Button" && q.type != "Checkbox") return "";

    var option_placeholder = "Enter option here...";
    var fill_placeholder = "Enter text that will replace the tag...";
    var html = "<div class=\"multiple-choices-container\">";
    for (var i = 0; i < q.options.length; i++) {
        var data_id_attribute = "data-id=\"" + i + "\"";
        var delete_onclick_attribute = "onclick=\"deleteMultipleChoiceFieldWithWarning(this," + i + ")\"";

        var text_area_elements = "<div class=\"text-area-container\">" + getTextAreaHTML(option_placeholder, q.options[i].option) + getTextAreaHTML(fill_placeholder, q.options[i].fill) + "</div>";
        html += "<div class=\"multiple-choice-container\"" + data_id_attribute + ">" + text_area_elements + "<button class=\"question-button small-circle-button\" " + delete_onclick_attribute + ">X</button>" + "</div>";
    }
    var add_multiple_choice_attribute = "onclick=\"addMultipleChoiceField(" + q.id + ")\"";
    html += "<button class=\"small-circle-button\" " + add_multiple_choice_attribute + ">+</button>";
    html += "</div>";
    return html;
}

function getTextAreaHTML(placeholder, value) {
    return "<textarea data-type=\"value\" class=\"text-area\" type=\"text\" placeholder=\"" + placeholder + "\" onkeyup=\"auto_grow(this)\">" + value + "</textarea>";
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

    if (document.getElementById(NAME_CONTAINER_TEXT_FIELD_ID).value.length === 0) {
        alert('Template name must be set');
        return;
    }

    var template = {
        name: document.getElementById('name-container-text-field').value,
        text: letter,
        questions: getQuestions(),
        archived: false
    };

    if (imgData) {
        template.letterheadImg = imgData;
    }

    if (id) {
        console.log("updating template");
        $.ajax({
            url: 'http://localhost:3000/template-editor/update',
            data: {
                id: id,
                template: template
            },
            type: 'POST',
            cache: false,
            complete: function (data) {
                console.log('complete');
            },
            success: function (data) {
                console.log('success');
                window.location.href = 'http://localhost:3000/template-dashboard'
            },
            error: function () {
                console.log('error');
            }
        });
    } else {
        console.log("creating template");
        $.ajax({
            url: 'http://localhost:3000/template-editor/create',
            data: {template: template},
            type: 'POST',
            complete: function () {
                console.log('complete');
            },
            success: function (data) {
                id = data.id;

                console.log('success');
                window.location.href = 'http://localhost:3000/template-dashboard'
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
        options: question.options,
        tag: question.tag
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
    var question = new Question("Radio Button", "", "");
    question.options.push(constructOptionObject("",""));
    questions.push(question);
    displayQuestions();
    hideAddQuestionModal();
}

function addCheckboxQuestion() {
    console.log("addCheckboxQuestion called");
    updateQuestions();
    var question = new Question("Checkbox", "", "");
    question.options.push(constructOptionObject("",""));
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
            questions[i].options[j].option = multipleChoices[j].querySelectorAll("[data-type='value']")[0].value;
            questions[i].options[j].fill = multipleChoices[j].querySelectorAll("[data-type='value']")[1].value;
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
    question.options.push(constructOptionObject("",""));
    updateQuestions();
    displayQuestions();
}

function constructOptionObject(option, fill) {
    return {option: option, fill: fill};
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

function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls)) ;
    return el;
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '\'\'' ? null : document.currentScript.getAttribute(attr).replace(/['"]+/g, '');
}
