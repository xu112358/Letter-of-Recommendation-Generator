const ADD_QUESTION_MODAL_ID = "add-question-modal";
const LETTER_CONTAINER_ID = "letter-container";
const CONTENT_ID = "content";
const TRIX_EDITOR = "trix-editor";
const OUTER_CONTAINER = "outer-container";


// eventually will be an array of letter content blocks (from backend)
var state = 'Lorem ipsum this is a great student very good I love them wowza! WOWOFOFOAOSF TYPOOOO';

var editable = [];
var sections = ['This is a recommendation letter for Bob.<br><br>Bob is a great student. Super! Yes!<br><br>Okay now onto more paragraphs...','extracurriculars','<ul><li>bizarre talents include</li><li>juggling</li><li>underwater basket weaving</li></ul>','section 3','sEcTiOn 4',"click me! ! !<br><strong>I'mBOLD.<br></strong><em>ok</em>"];
var curr_section;

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

  createLetterPreview();
}

// Renders innerHTML
function renderLetterDisplay(){
  var letterDisplayDiv = document.getElementById(LETTER_CONTAINER_ID);
  letterDisplayDiv.innerHTML = state;
}

function showEditModal(clicked) {
    curr_section = clicked;
    state = sections[curr_section];
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);

    var element = document.querySelector(TRIX_EDITOR);
    console.log("SHOWEDITMODAL state: "+state);
    console.log("SHOWEDITMODAL curr_section: "+curr_section);
    element.value = "";
    element.editor.insertHTML(state);

    modal.style.display = "block";
}

// Saves, exits, and updates letter preview
function saveEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    var element = document.querySelector(TRIX_EDITOR);

    console.log("HOW ITS SAVED: " + element.value);

    state = element.value;
    sections[curr_section] = state;
    renderSelectedDisplay();

    modal.style.display = "none";
}

// Closes without changing
function cancelEditModal() {
    var modal = document.getElementById(ADD_QUESTION_MODAL_ID);
    modal.style.display = "none";
}

// Updates current section innerHTML
function renderSelectedDisplay() {
  var selectedDisplayDiv = document.getElementById(curr_section);
  selectedDisplayDiv.innerHTML = state;
}

// Creates the divs for each item in array
function createLetterPreview() {
  for (var s in sections) {
      var newElement = document.createElement('div');
      newElement.id = s; 
      newElement.className = "letter-container";
      newElement.innerHTML = sections[s];
      newElement.onclick = function() {showEditModal(this.id);};
      var outerContainer = document.getElementById(OUTER_CONTAINER);
      outerContainer.appendChild(newElement);
  }
}

