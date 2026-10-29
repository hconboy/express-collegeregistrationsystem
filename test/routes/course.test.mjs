// test/routes/course.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

// Import the Express app
import app from "../../app.js";

// Set up test database
import testDB from "../utils/test_db.mjs";

// Import models used in tests
import Course from "../../models/course.js";

// Top-level suite for all Course Routes tests
test("Course Routes", async (t) => {
  // Connect to the test database before running all tests in this suite
  t.before(async () => {
    await testDB.connect();
  });

  // Close the test database connection after all tests in this suite
  t.after(async () => {
    await testDB.close();
  });

  // Clear the test database before each nested test
  t.beforeEach(async () => {
    await testDB.clearDatabase();
  });

  // Course List Routes Suite
  await t.test("Course List Routes", async (t) => {
    await t.test("GET /registry/courses", async () => {
      const res = await request(app).get("/registry/courses").expect(200);

      assert.ok(
        res.text.toLowerCase().includes("course list"),
        `Expected "course list" in response, got: ${res.text}`
      );
    });
  });

  // Course Detail Routes Suite
  await t.test("Course Detail Routes", async (t) => {
    await t.test(
      "should return course detail page for existing course",
      async () => {
        // Create a test course
        const course = new Course({
          id: "CS100",
          title: "Test Course",
          number_of_credits: 3,
        });

        await course.save();

        const res = await request(app)
          .get(`/registry/course/${course._id}`)
          .expect(200);

        assert.ok(
          res.text.includes("Test Course"),
          `Expected "Test Course" in response, got: ${res.text}`
        );
      }
    );

    await t.test("should return 404 for non-existent course", async () => {
      const fakeId = "64f1e0aa6a429f0f8d0d0d0d"; // valid ObjectId, doesn't exist
      await request(app).get(`/registry/course/${fakeId}`).expect(404);
    });
  });
});

