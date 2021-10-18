
//load country names and phone codes
let countryData;
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

  countryData = data;
  console.log(data);
  var length = data.length;
  for (var i = 0; i < length; i++){

    var ops = document.createElement("option");
    ops.setAttribute("value", data[i].phone_code);
    ops.setAttribute("name", data[i].country_name);
    ops.setAttribute("id", data[i].country_name);
    ops.innerHTML = data[i].country_name + " " + data[i].phone_code;
    document.getElementById("countryCode").append(ops);

  }

  loadProfile();
});


function loadProfile(){
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
    document.getElementById("countryCode").options.selectedIndex = data.selectedIndex;
    document.getElementById("telephone").value = data.phone;
    document.getElementById("university").value = data.university;
    document.getElementById("department").value = data.department;
    document.getElementById("address1").value = data.streetAddress;
    document.getElementById("address2").value = data.address2;
    document.getElementById("address3").value = data.city;
    document.getElementById("address4").value = data.statesProvinces;
    document.getElementById("postalCode").value = data.postalCode;
  });
}




//add eventListener to info icons
document.getElementById("general").onclick = function(e){

  document.getElementById("exampleModalLabel").innerHTML = "User Profile Guidance"
  document.getElementById("instructions").innerHTML = "User info are needed as part of the letter generation process. Institutions that read the recommendation letter may contact you accroding to the information you provided."
  document.getElementById("open-modal").click();
}

document.getElementById("title-help").onclick = function(e){

  document.getElementById("exampleModalLabel").innerHTML = "Title Guidance"
  document.getElementById("instructions").innerHTML = "Titles are your university/college job titles. Professor of the Business Department, Dean of the Engineering School, Associate Professor of Finance could be a valid title. " +
  "If you have multiple titles, hit enter after you finish typing one of your titles.";
  document.getElementById("open-modal").click();
}

document.getElementById("address-help").onclick = function(e){
  
  document.getElementById("exampleModalLabel").innerHTML = "Address Guidance"
  document.getElementById("instructions").innerHTML = "Put down address of your school office if you have one. If not, put down the address of your department";
  document.getElementById("open-modal").click();

}





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

  if (firstName.length == 0) {

    alert("Please fill in your firstname");
    return false;
  }
  var middleName = document.getElementById("mname").value.trim();
  var lastName = document.getElementById("lname").value.trim();

  if (lastName.length == 0){

    alert("Please fill in your lastname");
    return false;
  }
  var university = document.getElementById("university").value.trim();

  if (university.length == 0){

    alert("Please fill in the university you are working at");
    return false;
  }
  var department = document.getElementById("department").value.trim();

  if (department.length == 0){

    alert("Please fill in the department you are at");
    return false;
  }

  var titles = document.getElementById("titles").value.trim();

  if (titles.length == 0){

    alert("Please fill in your job title");
    return false;
  }
  var e1 = document.getElementById("countryCode");
  var index = e1.options.selectedIndex;
  var codes = e1.options[index].value;
  var phone = document.getElementById("telephone").value;

  if (phone.length == 0){

    alert("Please fill in your phone number");
    return false;
  }
  var country = e1.options[index].getAttribute("name");
  var streetAddress = document.getElementById("address1").value.trim();

  if (streetAddress.length == 0){

    alert("Please fill in the street address of your on-campus office");
    return false;
  }
  var address2 = document.getElementById("address2").value.trim();

  var city = document.getElementById("address3").value.trim();
  if (city.length == 0) {
    alert("Please fill in the city which your office is at");
    return false;
  }

  var statesProvince = document.getElementById("address4").value.trim();

  if (statesProvince.length == 0){
    alert("Please fill in the state/provice which your office is at");
    return false;
  }
  var postalCode = document.getElementById("postalCode").value;

  if (postalCode.length == 0){

    alert("Please fill in the postal/zip code for your office");
    return false;
  }

  
  var json = {userInfo: [
    firstName,
    middleName,
    lastName,
    university,
    department,
    titles,
    codes,
    phone,
    streetAddress,
    address2,
    city,
    statesProvince,
    postalCode,
    country,
    index,
  ]};

  console.log(json);
  $.ajax({
    url: "/users/profile",
    data: {
      raw: JSON.stringify(json) 
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
    }
  });
}
