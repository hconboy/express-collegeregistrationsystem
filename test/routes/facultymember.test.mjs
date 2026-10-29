// test/routes/course.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

// Import the Express app
import app from "../../app.js";

// Set up test database
import testDB from "../utils/test_db.mjs";

// Import models used in tests
import FacultyMember from "../../models/facultymember.js";

// Top-level suite for all Faculty Routes tests
test("Faculty Member Routes", async (t) => {
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

  // Faculty List Routes Suite
  await t.test("Faculty List Routes", async (t) => {
    await t.test("GET /registry/facultymembers", async () => {
      assert.ok(false, true, "Test is not implemented yet."
      );
    });
  });

  // Faculty Detail Routes Suite
  await t.test("Faculty Detail Routes", async (t) => {
    await t.test(
      "should return faculty detail page for existing faculty member",
      async () => {
        assert.ok(false, true, "Test is not implemented yet."); 
      }
    );

    await t.test("should return 404 for non-existent faculty member", async () => {
      assert.ok(false, true, "Test is not implemented yet.");
    });
  });
});

