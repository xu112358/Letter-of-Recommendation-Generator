var id = parseAttribute('id');
const EMAIL_TITLE_ID = "name-container-text-field";
const EMAIL_SUBECT_TEXT_AREA_ID = "email-subject-text-area";
const EMAIL_BODY_TEXT_AREA_ID = "email-body-text-area";


window.onload = function () {
    // document.getElementById(EMAIL_TITLE_ID).addEventListener('paste', function (e) {
    //     e.preventDefault();

    //     if (e.clipboardData) {
    //         content = (e.originalEvent || e).clipboardData.getData('text/plain');

    //         document.execCommand('insertText', false, content);
    //     } else if (window.clipboardData) {
    //         content = window.clipboardData.getData('Text');

    //         document.selection.createRange().pasteHTML(content);
    //     }
    // });

    // if (id) {
    //     $.ajax({
    //         url: 'http://localhost:3000/email-template-editor/template',
    //         data: {id},
    //         type: 'GET',
    //         success: function (data) {
    //             document.getElementById(EMAIL_TITLE_ID).innerHTML = encodeLetterHTML(data.letter);
    //             console.log('success');
    //         },
    //         error: function () {
    //             console.log('error');
    //         }
    //     });
    // } else {
    //     loadDefaultTemplates();
    // }
};

function loadDefaultTemplates() {
   var subject; 
   var body;
}

function parseAttribute(attr) {
    return document.currentScript.getAttribute(attr) == '' ? null : document.currentScript.getAttribute(attr);
}

function saveEmailTemplate() {
    console.log("saveEmailTemplate called");

    var Email = {
        title: document.getElementById(EMAIL_TITLE_ID).value,
        subject: document.getElementById(EMAIL_SUBECT_TEXT_AREA_ID).value,
        body_text: document.getElementById(EMAIL_BODY_TEXT_AREA_ID).value,
        active: true
    };

    if (id) {

        $.ajax({
            url: 'http://localhost:3000/email-template-editor/update',
            data: {
                id: id,
                Email: Email
            },
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

       
    } else {

        $.ajax({
            url: 'http://localhost:3000/email-template-editor/addEmailTemplate',
            data: {
                id: id,
                Email: Email
            },
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
    // if (!validate(Emailtemplate)) {
    //     window.scrollTo(errorScrollCoordinates.x, errorScrollCoordinates.y);
    //     emphasizeTags();
    //     return;
    // }
}