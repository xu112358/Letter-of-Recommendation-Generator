const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const CONTENT_ID = "content";
const TRIX_EDITOR = "trix-editor";


// eventually will be an array of letter content blocks (from backend)
var state = 'Lorem ipsum this is a great student very good I love them wowza! WOWOFOFOAOSF TYPOOOO';


$('.example')
  .form({
    fields: {
      content: {
        identifier  : 'content',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a value'
          }
        ]
      }
    }
});

document.addEventListener("trix-change", function(event) {
  //$('pre').html($(event.target).text());
  //state = (event.target).text();
});


// body
function onLoad(){
  // populate with the clicked text
  var modal = document.getElementById(CONTENT_ID);
  modal.setAttribute("value", state);

  renderLetterDisplay();
}

// Renders innerHTML
function renderLetterDisplay(){
  var letterDisplayDiv = document.getElementById(LETTER_CONTAINER_ID);
  letterDisplayDiv.innerHTML = state;
}

function showEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);

    var element = document.querySelector(TRIX_EDITOR);
    console.log(element);
    element.value = "";
    element.editor.insertHTML(state);

    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);

    var element = document.querySelector(TRIX_EDITOR);

    console.log("HOW ITS SAVED: " + element.value);
    // Using doc.toString() strips formatting right now, because I don't parse it yet in render.
    //var doc = element.editor.getDocument();
    //state = doc.toString();
    state = element.value;
    renderLetterDisplay();
    modal.style.display = "none";
}

// Closes without changing
function cancelEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

