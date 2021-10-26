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
        email: "test1@usc.edu",
        password: "Test User1",
      });
      await testUser.save();
    });

    afterAll((done) => {
      done();
    });

    test("User Profile Update Test", async () => {
      //this can be changed
      //could be done using random string generator
      var data = {
        userInfo: [
          "John",
          "H.",
          "Doe",
          "USC",
          "BUSINESS",
          "Student",
          "+1",
          "0123456789",
          "123 St",
          "APT 456",
          "LA",
          "CA",
          "90089",
          "United States",
          235,
          true,
        ],
      };

      var token = jwt.sign(
        {
          iss: "Letter of Recommendation Generator",
          aud:
            "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com",
          email: "test1@usc.edu",
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
      const updatedUser = await User.findOne({ email: "test1@usc.edu" });
      expect(updatedUser.firstName).toBe(data.userInfo[0]);
      expect(updatedUser.middleName).toBe(data.userInfo[1]);
      expect(updatedUser.lastName).toBe(data.userInfo[2]);
      expect(updatedUser.university).toBe(data.userInfo[3]);
      expect(updatedUser.department).toBe(data.userInfo[4]);
      expect(updatedUser.titles).toBe(data.userInfo[5]);
      expect(updatedUser.codes).toBe(data.userInfo[6]);
      expect(updatedUser.phone).toBe(data.userInfo[7]);
      expect(updatedUser.streetAddress).toBe(data.userInfo[8]);
      expect(updatedUser.address2).toBe(data.userInfo[9]);
      expect(updatedUser.city).toBe(data.userInfo[10]);
      expect(updatedUser.statesProvinces).toBe(data.userInfo[11]);
      expect(updatedUser.postalCode).toBe(data.userInfo[12]);
      expect(updatedUser.country).toBe(data.userInfo[13]);
      expect(updatedUser.selectedIndex).toBe(data.userInfo[14]);
      expect(updatedUser.isProfileSet).toBe(data.userInfo[15]);
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
