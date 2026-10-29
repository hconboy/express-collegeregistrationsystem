#! /usr/bin/env node

console.log(
  'This script populates some test courses, course sections, faculty members and students to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://yourusername:yourpassword@cluster0.yourmongoconnect.mongodb.net/college_registration_system?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Course = require("./models/course");
const FacultyMember = require("./models/facultymember");
const CourseSection = require("./models/coursesection");

const courses = [];
const facultymembers = [];
const coursesections = [];

const mongoose = require("mongoose");

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCourses();
  await createFacultyMembers();
  await createCourseSections();
  console.log("Debug: Closing mongoose");
  await mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.

async function facultymemberCreate(index, id, name, department, degree) {
  const facultymemberdetail = { id: id, name: name, department: department, degree: degree };

  const facultymember = new FacultyMember(facultymemberdetail);

  await facultymember.save();
  facultymembers[index] = facultymember;
  console.log(`Added faculty member: ${name}`);
}

async function courseCreate(index, id, title, number_of_credits) {
  const coursedetail = {
    id,
    title,
    number_of_credits
  };

  const course = new Course(coursedetail);
  await course.save();
  courses[index] = course;
  console.log(`Added course: ${title}`);
}

async function courseSectionCreate(index, id, title, course, faculty, section_number, meeting_days) {
  const coursesectiondetail = {
    id,
    title,
    course,
    faculty,
    section_number,
    meeting_days
  };
  const coursesection = new CourseSection(coursesectiondetail);
  await coursesection.save();
  coursesections[index] = coursesection;
  console.log(`Added course section: ${title} ${section_number}`);
}

async function createFacultyMembers() {
  console.log("Adding faculty members");
  await Promise.all([
    facultymemberCreate(0, "4", "Dr. Conboy", "Computer Science", "PhD"),
    facultymemberCreate(1, "5", "Dr. Endres", "Computer Science", "PhD"),
    facultymemberCreate(2, "6", "Dr. Perretta", "Computer Science", "PhD"),
  ]);
}

async function createCourses() {
  console.log("Adding courses");
  await Promise.all([
    courseCreate(0, "CS320", "Introduction to Software Engineering", 4),
    courseCreate(1, "CS429", "Software Engineering Project Management", 3),
  ]);
}

async function createCourseSections() {
  console.log("Adding course sections");
  await Promise.all([
    courseSectionCreate(
      0,
      "1",
      "Introduction to Software Engineering",
      courses[0],
      facultymembers[0],
      "2",
      "TueThu"
    ),
    courseSectionCreate(
      0,
      "2",
      "Introduction to Software Engineering",
      courses[0],
      facultymembers[1],
      "3",
      "TueThu"
    ),
    courseSectionCreate(
      0,
      "3",
      "Introduction to Software Engineering",
      courses[0],
      facultymembers[2],
      "1",
      "MonWed"
    ),
      courseSectionCreate(
      0,
      "4",
      "Software Engineering Project Management",
      courses[1],
      facultymembers[0],
      "2",
      "Fri"
    ),
    courseSectionCreate(
      0,
      "5",
      "Software Engineering Project Management",
      courses[1],
      facultymembers[1],
      "3",
      "Fri"
    ),
    courseSectionCreate(
      0,
      "6",
      "Software Engineering Project Management",
      courses[1],
      facultymembers[2],
      "1",
      "Fri"
    ),
  ]);
}

