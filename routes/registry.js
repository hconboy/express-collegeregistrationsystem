const express = require("express");

// Require controller modules.
const course_controller = require("../controllers/courseController");
const faculty_member_controller = require("../controllers/facultymemberController");
const course_section_controller = require("../controllers/coursesectionController");

const router = express.Router();

/// COURSEROUTES ///

// GET registry home page.
router.get("/", course_controller.index);

// GET request for creating a Course. NOTE This must come before routes that display Course (uses id).
router.get("/course/create", course_controller.course_create_get);

// POST request for creating Course.
router.post("/course/create", course_controller.course_create_post);

// GET request for one Course.
router.get("/course/:id", course_controller.course_detail);

// GET request for list of all Course items.
router.get("/courses", course_controller.course_list);

/// FACULTY ROUTES ///

// GET request for creating Faculty. NOTE This must come before route for id (i.e. display faculty).
router.get("/facultymember/create", faculty_member_controller.facultymember_create_get);

// POST request for creating Faculty.
router.post("/facultymember/create", faculty_member_controller.facultymember_create_post);

// GET request for one Faculty.
router.get("/facultymember/:id", faculty_member_controller.facultymember_detail);

// GET request for list of all Faculty.
router.get("/facultymembers", faculty_member_controller.facultymember_list);

/// COURSESECTION ROUTES ///

// GET request for creating a CourseSection. NOTE This must come before route that displays CourseSection (uses id).
router.get(
  "/coursesection/create",
  course_section_controller.coursesection_create_get,
);

// POST request for creating CourseSection.
router.post(
  "/coursesection/create",
  course_section_controller.coursesection_create_post,
);

// GET request for one CourseSection.
router.get("/coursesection/:id", course_section_controller.coursesection_detail);

// GET request for list of all CourseSection.
router.get("/coursesections", course_section_controller.coursesection_list);

module.exports = router;