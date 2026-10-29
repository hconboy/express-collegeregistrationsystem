const Course = require("../models/course");
const CourseSection = require("../models/coursesection");
const FacultyMember = require("../models/facultymember");
const { body, validationResult } = require("express-validator");

/**
 * Display list of all Course Sections.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.coursesection_list = async (req, res, next) => {
  const allCourseSections = await CourseSection.find({}, "title course faculty")
    .sort({ title: 1 })
    .populate("course")
    .populate("faculty")
    .exec();

  res.render("coursesection_list", { title: "Course Sections", coursesection_list: allCourseSections });
};

/**
 * Display detail page for a specific CourseSection.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.coursesection_detail = async (req, res, next) => {
  // Get details of books, book instances for specific book
  const [coursesection] = await Promise.all([
    CourseSection.findById(req.params.id).populate("course").populate("faculty").exec(),
  ]);

  if (coursesection === null) {
    // No results.
    const err = new Error("CourseSection not found");
    err.status = 404;
    return next(err);
  }

  res.render("coursesection_detail", {
    title: coursesection.title,
    coursesection,
  });
};

/**
 * Display CourseSection create form on GET.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.coursesection_create_get = async (req, res, next) => {
    // Get all authors and genres, which we can use for adding to our book.
  const [allCourses, allFacultyMembers] = await Promise.all([
    Course.find().sort({ title: 1 }).exec(),
    FacultyMember.find().sort({ name: 1 }).exec(),
  ]);

  res.render("coursesection_form", {
    title: "Create Course Section",
    courses: allCourses,
    facultymembers: allFacultyMembers,
  });
};

/**
 * Handle CourseSection create on POST.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.coursesection_create_post = [
  // Validate and sanitize fields.
  body("id", "ID must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("course", "Course must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("section_number", "Section Number must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("meeting_days", "Meeting Days must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("faculty", "Faculty must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a CourseSection object with escaped and trimmed data.
    const coursesection = new CourseSection({
      id: req.body.id,
      title: req.body.title,
      course: req.body.course,
      section_number: req.body.section_number,
      meeting_days: req.body.meeting_days,
      faculty: req.body.faculty,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all courses and faculty members for form.
      const [allCourses, allFacultyMembers] = await Promise.all([
        Course.find().sort({ title: 1 }).exec(),
        FacultyMember.find().sort({ name: 1 }).exec(),
      ]);

      res.render("coursesection_form", {
        title: "Create Course Section",
        courses: allCourses,
        facultymembers: allFacultyMembers,
        coursesection,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid. Save book.
    await coursesection.save();
    res.redirect(coursesection.url);
  },
];
