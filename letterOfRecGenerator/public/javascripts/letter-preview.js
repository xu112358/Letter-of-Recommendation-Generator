var id = parseAttribute('id');

const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const TRIX_EDITOR = "trix-editor";
const OUTER_CONTAINER = "outer-container";

var form;
var letterHTML;
var tagRegex = /\<\![a-z0-9_]+\>/ig;

// body
function onLoad() {
    $.ajax({
        url: 'http://localhost:3000/letter-preview/form',
        data: {id},
        type: 'GET',
        success: function (data) {
            form = data;
            console.log('success');
            letterHTML = createLetterPreview(form, form.letter);
            $.ajax({
                url: 'http://localhost:3000/letter-preview/save',
                data: {
                    id: id,
                    letter: letterHTML
                },
                type: 'POST',
                success: function (data) {
                    console.log('letter saved');
                },
                error: function () {
                    console.log('error');
                }
            });
        },
        error: function () {
            console.log('error');
        }
    });
}

function showEditModal(clicked) {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);
    element.value = "";
    element.editor.setSelectedRange([0, 0]);
    element.editor.insertHTML(letterHTML);

    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);

    letterHTML = element.value.replace(/\<div\>/, '<div id="print">');
    document.getElementById(LETTER_CONTAINER_ID).innerHTML = letterHTML;

    $.ajax({
        url: 'http://localhost:3000/letter-preview/save',
        data: {
            id: id,
            letter: letterHTML
        },
        type: 'POST',
        success: function (data) {
            console.log('letter saved');
        },
        error: function () {
            console.log('error');
        }
    });

    modal.style.display = "none";
}

// Closes without changing
function cancelEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

// Creates the divs for each item in array
function createLetterPreview(form, letter) {
    var letterContainer = document.createElement('div');
    letterContainer.id = LETTER_CONTAINER_ID;
    var innerContainer = document.createElement('div');
    innerContainer.id = 'print';
    letterContainer.onclick = function () {
        showEditModal(this.id);
    };
    letterContainer.style.cursor = 'pointer';
    var outerContainer = document.getElementById(OUTER_CONTAINER);
    if (form.template.letterheadImg != null) {
        var letterhead = document.createElement('img');
        letterhead.src = form.template.letterheadImg;
        letterhead.alt = "";
        letterhead.className = "letterhead-img";
        innerContainer.appendChild(letterhead)
    }

    if (letter) {
        letterHTML = letter;
    } else {
        letterHTML = encodeLetterHTML(parseLetter(form));
    }

    innerContainer.innerHTML += letterHTML;

    if (form.template.footerImg != null) {
        var footer = document.createElement('img');
        footer.src = form.template.footerImg;
        footer.alt = "";
        footer.className = "footer-img";
        innerContainer.appendChild(footer)
    }

    letterContainer.appendChild(innerContainer);
    outerContainer.appendChild(letterContainer);

    return innerContainer.innerHTML;
}

function parseLetter(form) {
    var letter = form.template.text;
    var responses = form.responses;

    var noCapitalization = Array.from(letter.replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }).replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }));

    for (var i = 0; i < noCapitalization.length; i++) {

        // Found ending punctuation that isn't the last letter in the text
        if ((noCapitalization[i] == '.' || noCapitalization[i] == '?' || noCapitalization[i] == '!') && i != noCapitalization.length - 1) {

            // Make sure exclamation point is not from a tag
            if (noCapitalization[i] == '!' && i > 0 && noCapitalization[i - 1] == '<') {
                continue;
            }

            // Look for the next alphabetical character to capitalize
            var j = i + 1;
            while (!((noCapitalization[j] >= 'a' && noCapitalization[j] <= 'z') || (noCapitalization[j] >= 'A' && noCapitalization[j] <= 'Z')) && j < noCapitalization.length) {
                j++;
            }

            // Found character to capitalize
            if (j < noCapitalization.length) {
                noCapitalization[j] = noCapitalization[j].toUpperCase();
            }
        }
    }

    return noCapitalization.join("");
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '\'\'' ? null : document.currentScript.getAttribute(attr).replace(/['"]+/g, '');
}

function encodeLetterHTML(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/gi, '<br>');
}
