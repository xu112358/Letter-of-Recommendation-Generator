// Show options if checkbox or multiple choice is selected
document.querySelector("form").addEventListener("change", (event) => {
  console.log(event.target);
  var select = event.target;
  var value = select.options[select.selectedIndex].value;
  if (value == "Multiple Choice" || value == "Checkboxes") {
    var selectedCard = event.target.closest(".card");
    selectedCard.querySelector(".options").classList.remove("d-none");
  }
  else {
    var selectedCard = event.target.closest(".card");
    selectedCard.querySelector(".options").classList.add("d-none");
  }
});

// Add option
document.querySelector(".add-options-btn").addEventListener("click", (event) => {
  // Find options div of current card
  var selectedOptions = event.target.closest(".options");
  console.log(selectedOptions);
  
  var newOption = document.createDocumentFragment();

  var row = document.createElement("div");
  row.classList.add("row");

  var col1 = document.createElement("div");
  col1.classList.add("col-radio-input");

  var col2 = document.createElement("div");
  col2.classList.add("col-radio-delete");

  var input = document.createElement("input");
  input.type = "text";
  input.classList.add("form-control");
  input.placeholder = "Option";
  
  var icon = document.createElement("i");
  icon.classList.add("fas", "fa-times");

  col1.appendChild(input);
  col2.appendChild(icon);
  row.appendChild(col1);
  row.appendChild(col2);
  newOption.appendChild(row);

  // Inserts new option before add option button
  var buttonRow = event.target.closest(".row");
  selectedOptions.insertBefore(newOption, buttonRow);
});

// Delete option
document.querySelector(".options").addEventListener("click", (event) => { 
  var targetElem = event.target.closest(".col-radio-delete");
  if (!targetElem) return;
  targetElem.closest(".row").remove();

});

// Add question
document.querySelector(".add-questions-btn").addEventListener("click", (event) => {
  var form = document.querySelector("form");

  var newQuestion = document.createDocumentFragment();

  var card = document.createElement("div");
  card.classList.add("card", "container", "align-middle");

  var question = document.createElement("div");
  question.classList.add("row");

  var col1 = document.createElement("div");
  col1.classList.add("col-8");

  var ques_input = document.createElement("input");
  ques_input.type = "text";
  ques_input.classList.add("form-control");
  ques_input.placeholder = "Question";

  var col2 = document.createElement("div");
  col2.classList.add("col-4");

  var select = document.createElement("select");
  select.classList.add("form-select");

  var option1 = document.createElement("option");
  option1.value = "Text";
  option1.innerHTML = "Text";
  var option2 = document.createElement("option");
  option2.value = "Multiple Choice";
  option2.innerHTML = "Multiple Choice";
  var option3 = document.createElement("option");
  option3.value = "Checkboxes";
  option3.innerHTML = "Checkboxes";

  var options = document.createElement("div");
  options.classList.add("options", "d-none");

  var tag = document.createElement("div");
  tag.classList.add("row");
  
  var col3 = document.createElement("div");
  col3.classList.add("col-4");

  var tag_input = document.createElement("input");
  tag_input.type = "text";
  tag_input.classList.add("form-control");
  tag_input.placeholder = "Tag";

  var col4 = document.createElement("div");
  col4.classList.add("col", "align-self-end");

  var icon = document.createElement("i");
  icon.classList.add("fas", "fa-trash", "float-end");

  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  
  col2.appendChild(select);
  col1.appendChild(ques_input);

  question.appendChild(col1);
  question.appendChild(col2);

  col4.appendChild(icon);
  col3.appendChild(tag_input);

  tag.appendChild(col3);
  tag.appendChild(col4);

  card.appendChild(question);
  card.appendChild(options);
  card.appendChild(tag);

  form.appendChild(card);
});

//add eventListener to info icons
document.getElementById("default-questions-info").onclick = function(event) {

  document.getElementById("exampleModalLabel").innerHTML = "Default Questions"
  document.getElementById("instructions").innerHTML = "Default questions are automatically added to the form and default tags are automatically created for the questions."
  document.getElementById("open-modal").click();
}