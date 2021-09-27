function updateProfile() {
  var firstName = document.getElementById("fname").value;
  var middleName = document.getElementById("mname").value;
  var lastName = document.getElementById("lname").value;
  var titles = document.getElementById("titles").value;
  var phone = document.getElementById("telephone").value;
  var school = document.getElementById("school").value;
  var address = document.getElementById("address").value;

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
