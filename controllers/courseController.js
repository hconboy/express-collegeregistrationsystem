const Course = require("../models/course");
const CourseSection = require("../models/coursesection");
const FacultyMember = require("../models/facultymember");
const { body, validationResult } = require("express-validator");

/**
 * Displays the index page for the College Registration System.
 * 
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.index = async (req, res, next) => {
  const [
    numCourses,
    numCourseSections,
    numFacultyMembers,
  ] = await Promise.all([
    Course.countDocuments({}).exec(),
    CourseSection.countDocuments({}).exec(),
    FacultyMember.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "College Registration System Home",
    course_count: numCourses,
    coursesection_count: numCourseSections,
    facultymember_count: numFacultyMembers,
  });
};

/**
 * Display list of all Courses.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.course_list = async (req, res, next) => {
  const allCourses = await Course.find({}, "title")
    .sort({ title: 1 })
    .exec();

  res.render("course_list", { title: "Course List", course_list: allCourses });
};

/**
 * Display detail page for a specific Course.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.course_detail = async (req, res, next) => {
  // Get details of courses and their sections.,
  const [course, courseSections] = await Promise.all([
    Course.findById(req.params.id).exec(),
    CourseSection.find({ course: req.params.id }).exec(),
  ]);

  if (course === null) {
    // No results.
    const err = new Error("Course not found");
    err.status = 404;
    return next(err);
  }

  res.render("course_detail", {
    title: course.title,
    course,
    course_sections: courseSections,
  });
};

/**
 * Display Course create form on GET.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.course_create_get = async (req, res, next) => {
  res.render("course_form", { title: "Create Course" });
};

/**
 * Handle Course create on POST.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.course_create_post = [
  // Validate and sanitize fields.
  body("id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("ID must be specified."),
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified."),
  body("number_of_credits")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Number of credits must be specified."),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Course object with escaped and trimmed data
    const course = new Course({
      id: req.body.id,
      title: req.body.title,
      number_of_credits: req.body.number_of_credits,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("course_form", {
        title: "Create Course",
        course,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Save and redirect to new course record.
    await course.save();
    res.redirect(course.url);
  },
];
