//load user profile
let codes;
$.ajax({
  url: "/users/profile/get",
  data: {},
  type: "GET",
  complete: function () {
    console.log("profile loaded");
    console.log();
  },
  error: function () {
    console.log("error in loading user profile");
  },
}).done(function (data) {
  console.log(data);
  document.getElementById("fname").value = data.firstName;
  document.getElementById("mname").value = data.middleName;
  document.getElementById("lname").value = data.lastName;
  document.getElementById("titles").value = data.titles;
  document.getElementById("telephone").value = data.phone;
  document.getElementById("school").value = data.school;
  document.getElementById("address").value = data.address;
});



//load country names and phone codes
$.ajax({
  url: "/api/countryCodes",
  type:"GET"
}).done(function (data) {

  
  //populate drop down
  function compare(a, b){

    if (a.country_name < b.country_name){
      return -1;
    }
    if (a.country_name > b.country_name){
      return 1;
    }
    return 0;
  }




  data.sort(compare);

  console.log(data);
  var length = data.length;
  for (var i = 0; i < length; i++){

    var ops = document.createElement("option");
    ops.setAttribute("value", data[i].phone_code);
    ops.innerHTML = data[i].country_name + " " + data[i].phone_code;
    document.getElementById("countryCode").append(ops);

  }
});





function getCountryCode(){

  $.ajax({
    url: "/api/countryCodes",
    type: "GET",
  }).done(function (data){

    console.log(data);
  });
}

function updateProfile() {
  var firstName = document.getElementById("fname").value.trim();
  var middleName = document.getElementById("mname").value.trim();
  var lastName = document.getElementById("lname").value.trim();
  var titles = document.getElementById("titles").value.trim();
  var phone = document.getElementById("telephone").value;
  var school = document.getElementById("school").value.trim();
  var address = document.getElementById("address").value.trim();

  //empty input for required field
  if (
    firstName.length == 0 ||
    lastName.length == 0 ||
    titles.length == 0 ||
    phone.length == 0 ||
    school.length == 0 ||
    address.length == 0
  ) {
    alert("Please fill in required field");
    return false;
  }

  $.ajax({
    url: "/users/profile",
    data: {
      userInfo: [
        firstName,
        middleName,
        lastName,
        titles,
        phone,
        school,
        address,
      ],
    },
    type: "POST",
    complete: function () {
      console.log(
        "successfully updated user profile for " + firstName + " " + lastName
      );
      window.location.href = "/recommender-dashboard";
    },
    error: function () {
      console.log(
        "error in updating profile for " + firstname + " " + lastName
      );
    },
  });
}
