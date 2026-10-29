const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Retpresents a course in the registry identified by a unique course id, title, and number of credits.
 */
const CourseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  number_of_credits: { type: Number, required: true, default: 3 },
});

// Virtual for book's URL
CourseSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/registry/course/${this._id}`;
});

// Export model
module.exports = mongoose.model("Course", CourseSchema);