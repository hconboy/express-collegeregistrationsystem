const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Retpresents a course section in the registry identified by a unique id, title, course, faculty, section number, and meeting days.
 */
const CourseSectionSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  faculty: { type: Schema.Types.ObjectId, ref: "FacultyMember", required: true },
  section_number: { type: Number, required: true },
  meeting_days: { type: String, required: true },
});

// Virtual for book's URL
CourseSectionSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/registry/coursesection/${this._id}`;
});

// Export model
module.exports = mongoose.model("CourseSection", CourseSectionSchema);