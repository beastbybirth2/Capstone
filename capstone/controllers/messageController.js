const User = require("../models/user");

const isAuthenticated = (req, res) => {
  if (req.isAuthenticated()) {
    return true;
  } else res.redirect("/auth/login");
};

const isVerified = (req, res, next) => {
  if (!req.isAuthenticated()) return res.redirect("/auth/login");
  next();
};

const addTeacher = async (studentId, teacherId, sender) => {
  try {
    const student = await User.findOne({ role: "student", _id: studentId });
    if (!student) {
      return { success: false, message: "Student not found" };
    }

    const teacher = await User.findOne({ role: "teacher", _id: teacherId });
    if (!teacher) {
      return { success: false, message: "Teacher not found" };
    }

    const students = {
      [student.id]: {
        id: student.id,
        name: student.name,
      },
    };

    if (teacher.students && teacher.students[student.id]) {
      throw new Error("Student is already on the teacher's list");
    }

    teacher.students = { ...teacher.students, ...students };
    sender === "teacher"
    ? teacher.requests.sent.pull(studentId)
    : teacher.requests.received.pull(studentId);
  console.log(teacher);
    await teacher.save();

    const teachers = {
      [teacher.id]: {
        id: teacher.id,
        name: teacher.name,
      },
    };

    if (!student.teachers) {
      student.teachers = {}; // Create the teachers object if it doesn't exist
    }

    student.teachers = { ...student.teachers, ...teachers };
    
    sender === "student"
      ? student.requests.sent.pull(teacherId)
      : student.requests.received.pull(teacherId);
    console.log(student);
    await student.save();

    return { success: true, message: "Student added successfully" };
  } catch (error) {
    console.error("Error adding student:", error);
    return { success: false, message: `An error occurred: ${error}` };
  }
};
module.exports = {
  isAuthenticated,
  isVerified,
  addTeacher,
};
