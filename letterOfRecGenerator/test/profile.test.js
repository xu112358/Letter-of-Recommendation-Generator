const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const db = require("../db");
const common = require("./common");

describe("Unit Test for Profile", () => {
  let testUser;
  beforeAll(async () => {
    testUser = new User({
      email: "test2@usc.edu",
      password: "Test User2",
    });
    await testUser.save();
  });

  afterAll(done => {
    User.deleteOne({ email: "test2@usc.edu" }, function (err) {
      done();
    });
    db.disconnect(done);
  });

  test("User Profile Update Test", async () => {
    //this can be changed
    //could be done using random string generator
    var data = {
      firstName: "John",
      middleName: "H.",
      lastName: "Doe",
      university: "USC",
      department: "BUSINESS",
      titles: "Student",
      codes: "+1",
      phone: "0123456789",
      streetAddress: "123 St",
      address2: "APT 456",
      city: "LA",
      statesProvinces: "CA",
      postalCode: "90089",
      country: "United States",
      selectedIndex: 235,
    };

    await request(app)
      .post("/users/profile")
      .set("Authorization", "Bearer " + common.token)
      .send({ user: testUser, raw: JSON.stringify(data) });

    //query db again
    const updatedUser = await User.findOne({ email: "test2@usc.edu" });

    expect(updatedUser.firstName).toBe(data.firstName);
    expect(updatedUser.middleName).toBe(data.middleName);
    expect(updatedUser.lastName).toBe(data.lastName);
    expect(updatedUser.university).toBe(data.university);
    expect(updatedUser.department).toBe(data.department);
    expect(updatedUser.titles).toBe(data.titles);
    expect(updatedUser.codes).toBe(data.codes);
    expect(updatedUser.phone).toBe(data.phone);
    expect(updatedUser.streetAddress).toBe(data.streetAddress);
    expect(updatedUser.address2).toBe(data.address2);
    expect(updatedUser.city).toBe(data.city);
    expect(updatedUser.statesProvinces).toBe(data.statesProvinces);
    expect(updatedUser.postalCode).toBe(data.postalCode);
    expect(updatedUser.country).toBe(data.country);
    expect(updatedUser.selectedIndex).toBe(data.selectedIndex);
    expect(updatedUser.isProfileSet).toBe(true);
  });
}, 10000);
