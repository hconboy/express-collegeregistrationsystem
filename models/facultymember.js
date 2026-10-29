const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Retpresents a faculty member in the registry identified by a unique id, name, department, and degree.
 */
const FacultyMemberSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, maxLength: 100 },
  department: { type: String, required: true, maxLength: 100 },
  degree: { type: String, required: true, maxLength: 50 },
});

// Virtual for book's URL
FacultyMemberSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/registry/facultymember/${this._id}`;
});

// Export model
module.exports = mongoose.model("FacultyMember", FacultyMemberSchema);
 