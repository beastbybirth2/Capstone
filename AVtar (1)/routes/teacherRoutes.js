const express = require("express");
const router = express.Router();
const {
  ensureTeacher,
  isTeacher,
} = require("../controllers/teacherController");
const { addTeacher } = require("../controllers/messageController");
const User = require("../models/user");
const Quiz = require("../models/quiz");

router.get("/welcome",  (req, res) => {
  res.render("teachers/welcome");
});

router.get("/dashboard",  (req, res) => {
  res.render("teachers/dashboard");
});

router.get("/chat",  (req, res) => {
  res.render("teachers/chatTeacher");
});

router.get("/addStudents",  (req, res) => {
  res.render("teachers/addStudents");
});

router.get("/sendRequest",  (req, res) => {
  res.render("teachers/sendRequest");
});

router.get("/createQuiz",  (req, res) => {
  res.render("teachers/createQuiz");
});

router.get("/getscores/:id",  (req, res) => {
  const id = req.params.id;
  console.log(id);
  res.render("teachers/getScores", { id });
});

router.get("/get-student",  async (req, res) => {
  const teacherId = req.user.id;
  try {
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const students = Object.values(teacher.students);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/acceptRequest", ensureTeacher, async (req, res) => {
  const { studentId } = req.body;
  const teacherId = req.user.id;

  const result = await addTeacher(studentId, teacherId, "student");

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ message: result.message });
  }
});

router.post("/rejectRequest", ensureTeacher, async (req, res) => {
  try {
    const { studentId } = req.body;
    const teacherId = req.user.id;
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) throw new Error("Teacher not found");

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) throw new Error("Student not found");

    teacher.requests.received.pull(studentId);
    student.requests.sent.pull(teacherId);
    await teacher.save();
    await student.save();

    return res.status(200).json({ message: "rejected request successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(404).send({ error: err.message });
  }
});

router.post("/createquiz", ensureTeacher, async (req, res) => {
  try {
    const { title, questions } = req.body;
    console.log(questions);
    if (!title || !questions || !Array.isArray(questions)) {
      throw new Error("Invalid input data");
    }

    const newQuiz = new Quiz({
      title: title,
      questions: questions,
      createdBy: req.user.id,
    });

    const savedQuiz = await newQuiz.save();

    return res
      .status(201)
      .send({ message: "Quiz created successfully", quiz: savedQuiz });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

router.get("/getquiz", ensureTeacher, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    console.log(quizzes);
    res.status(200).json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/studentscores/:id", ensureTeacher, async (req, res) => {
  try {
    const quizId = req.params.id;
    console.log(quizId);

    const theQuiz = await Quiz.findById(quizId);
    if (!theQuiz) throw new Error("Quiz not found");

    const scores = await User.find(
      {
        "quizScores.quiz": quizId,
      },
      {
        _id: 1,
        name: 1,
        "quizScores.$": 1,
      }
    );
    console.log(scores);

    return res.status(200).send({ quiz: theQuiz, studentScores: scores });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

module.exports = router;
