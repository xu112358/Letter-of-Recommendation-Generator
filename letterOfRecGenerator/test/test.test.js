const request = require("supertest");
const app = require("../app");
const db = require("../db");
const User = require("../models/user");

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

  /* describe("Unit Test for Profile", () => {
    beforeAll(() => {});

    afterAll((done) => {
      done();
    });

    test("User Profile Update Test", async () => {
      var data = {
        userInfo: [
          "John",
          "H.",
          "Doe",
          "USC",
          "CS",
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
      await request(app).post("/users/dummy");
      await request(app)
        .post("/users/profile")
        .send({ raw: JSON.stringify(data) });

      const updatedUser = await request(app).get("/users/profile/get");
      expect(updatedUser.firstName).toBe("John");
      expect(updatedUser.middleName).toBe("H.");
      expect(updatedUser.lastName).toBe("Doe");
      expect(updatedUser.university).toBe("USC");
      expect(updatedUser.department).toBe("CS");
      expect(updatedUser.codes).toBe("+1");
      expect(updatedUser.phone).toBe("0123456789");
      expect(updatedUser.streetAddress).toBe("123 St");
      expect(updatedUser.address2).toBe("APT 456");
      expect(updatedUser.city).toBe("LA");
      expect(updatedUser.postalCode).toBe("90089");
      expect(updatedUser.country).toBe("United States");
      expect(updatedUser.selectedIndex).toBe(235);
      expect(updatedUser.isProfileSet).toBe("true");
    });
  }); */

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
