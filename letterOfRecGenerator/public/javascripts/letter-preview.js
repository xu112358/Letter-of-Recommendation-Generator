var id = parseAttribute('id');

const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const TRIX_EDITOR = "trix-editor";
const OUTER_CONTAINER = "outer-container";

var innerContainer;
var form;
var letterHTML;
var templateData;
var tagRegex = /\<\![a-z0-9_]+\>/ig;

// body
function onLoad() {
    $.ajax({
        url: 'http://localhost:3000/letter-preview/form',
        data: {id},
        type: 'GET',
        success: function (data) {
            form = data;
            $.ajax({
                url: 'http://localhost:3000/template-editor/template',
                data: {id: data.template._id},
                type: 'GET',
                success: function (dat) {
                    console.log(data.template._id);
                    templateData = dat;
                    console.log(templateData);
                    templateData.letterheadImg = templateData.letterheadImg || form.template.letterheadImg;
                    templateData.footerImg = templateData.footerImg || form.template.footerImg;
                    console.log('success');
                    letterHTML = createLetterPreview(form, form.letter);
                    $.ajax({
                        url: 'http://localhost:3000/letter-preview/save',
                        data: {
                            id: id,
                            letter: letterHTML
                        },
                        type: 'POST',
                        success: function (da) {
                            console.log('letter saved');
                        },
                        error: function () {
                            console.log('error');
                        }
                    });
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
    element.editor.insertHTML(innerContainer.innerHTML);

    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);

    letterHTML = element.value;
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
    $(function() {
        var letterContainer = document.createElement('div');
        letterContainer.id = LETTER_CONTAINER_ID;
        innerContainer = document.createElement('div');
        innerContainer.id = 'print';
        letterContainer.onclick = function (e) {
            console.log(e.target);
            if (e.target.className.indexOf('resizable') != -1) {
                return;
            }
            showEditModal(this.id);
        };
        letterContainer.style.cursor = 'pointer';
        var outerContainer = document.getElementById(OUTER_CONTAINER);

        if (templateData.letterheadImg != null && !$('.letterhead-img').length) {
            var imgcontainer = document.createElement('div');
            imgcontainer.className = 'resizable';
            var letterhead = document.createElement('img');
            letterhead.src = templateData.letterheadImg;
            letterhead.className = "letterhead-img ui-widget-content";
            letterhead.id = "letterhead-img"
            letterhead.alt = "";
            imgcontainer.appendChild(letterhead);
            innerContainer.appendChild(imgcontainer);
        }

        if (letter) {
            letterHTML = letter;
        } else {
            letterHTML = encodeLetterHTML(parseLetter(form));
        }

        innerContainer.innerHTML += '<div id = "letter-text">' + letterHTML + '</div>';

        if (templateData.footerImg != null && !$('.footer-img').length) {
            var imgcontainer = document.createElement('div');
            imgcontainer.className = 'resizable';
            var footer = document.createElement('img');
            footer.src = templateData.footerImg;
            footer.alt = "";
            footer.id = "footer-img";
            footer.className = "footer-img ui-widget-content";
            imgcontainer.appendChild(footer);
            innerContainer.appendChild(imgcontainer);
        }


        letterContainer.appendChild(innerContainer);
        outerContainer.appendChild(letterContainer);
        $('.resizable').resizable();
        return innerContainer.innerHTML;
    });
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
