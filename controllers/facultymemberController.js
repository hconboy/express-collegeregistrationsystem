const Faculty = require("../models/facultymember");
const { body, validationResult } = require("express-validator");

/**
 * Display list of all Faculty.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.facultymember_list = async (req, res, next) => {
  const allFacultyMembers = await Faculty.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("facultymember_list", { title: "Faculty Member List", facultymember_list: allFacultyMembers });
};

/**
 * Display detail page for a specific Faculty.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.facultymember_detail = async (req, res, next) => {
  // Get details of faculty member.
  const [facultyMember] = await Promise.all([
    Faculty.findById(req.params.id).exec(),
  ]);

  if (facultyMember === null) {
    // No results.
    const err = new Error("Faculty member not found");
    err.status = 404;
    return next(err);
  }

  res.render("facultymember_detail", {
    title: facultyMember.name,
    facultyMember,
  });
};

/**
 * Display Faculty create form on GET.
 * @param {*} req The request from the user
 * @param {*} res The response to send back to the user
 * @param {*} next The next middleware function in the stack
 */
exports.facultymember_create_get = async (req, res, next) => {
res.render("facultymember_form", { title: "Create Faculty Member" });
};

exports.facultymember_create_post = [
  // Validate and sanitize fields.
  body("id")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("ID must be specified."),
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified."),
  body("department")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Department must be specified."),
  body("degree")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Degree must be specified."),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Faculty object with escaped and trimmed data
    const facultyMember = new Faculty({
      id: req.body.id,
      name: req.body.name,
      department: req.body.department,
      degree: req.body.degree,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("facultymember_form", {
        title: "Create Faculty Member",
        facultyMember,
        errors: errors.array(),
      });
      return;
    }

    // Data from form is valid.
    // Save and redirect to new faculty member record.
    await facultyMember.save();
    res.redirect(facultyMember.url);
  },
];