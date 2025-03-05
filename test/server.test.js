const request = require("supertest");
const app = require("../server"); // ✅ Ensure correct import
const { mongoose } = require("../db/conn"); // Import MongoDB connection

describe("API Tests", () => {
  test("GET / should return 'working'", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("working");
  });

  afterAll(async () => {
    await mongoose.connection.close(); // ✅ Close MongoDB after tests
  });
});
