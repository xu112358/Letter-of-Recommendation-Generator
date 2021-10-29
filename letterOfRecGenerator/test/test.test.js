const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("../models/user");
const fs = require("fs");
const path = require("path");
const privateKey = fs.readFileSync(
  path.join(__dirname, "../config/jwtRS256.key")
);
const jwt = require("jsonwebtoken");

describe("Unit Test for Letter of Recommendation Generator", () => {
  beforeAll(() => {});
  afterAll((done) => {
    db.disconnect(done);
    console.log("All Tests are done");
  });
  test("It should return 302 status code with GET method to home page", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(302);
      });
  });

  describe("Unit Test for Profile", () => {
    let testUser;
    beforeAll(async () => {
      testUser = new User({
        email: "test2@usc.edu",
        password: "Test User2",
      });
      await testUser.save();
    });

    afterAll((done) => {
      User.deleteOne({ email: "test2@usc.edu" }, function (err) {
        done();
      });
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

      var token = jwt.sign(
        {
          iss: "Letter of Recommendation Generator",
          aud: "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com",
          email: "test2@usc.edu",
        },
        privateKey,
        {
          algorithm: "RS256",
          expiresIn: "1h",
        }
      );
      await request(app)
        .post("/users/profile")
        .set("Authorization", "Bearer " + token)
        .send({ user: testUser, raw: JSON.stringify(data) });

      //query db again
      const updatedUser = await User.findOne({ email: "test2@usc.edu" });

      console.log(updatedUser);
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

  describe("Unit Test for Utility API and Resources", () => {
    test("Country Code API Should Have 200 Status", () => {
      request(app)
        .get("/api/countryCodes")
        .then((response) => {
          expect(response.statusCode).toBe(200);
        });
    });
  });
});
