const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Quiz = require("../models/quiz");
const User = require("../models/user");
const {
  ensureStudent,
  isStudent,
} = require("../controllers/studentController");
const { addTeacher } = require("../controllers/messageController");

router.get("/welcome", (req, res, next) => {
  if (isStudent(req, res)) {
    res.render("students/welcome");
  } else {
    res.status(403).send("Not authorized: " + err.message);
  }
});

router.get("/quiz", ensureStudent, (req, res) => {
  res.render("students/quiz");
});
router.get("/chat", ensureStudent, (req, res) => {
  res.render("students/chatStudent");
});
router.get("/game", (req, res) => {
  res.render("students/game");
});
router.get("/sendRequest", ensureStudent, (req, res) => {
  res.render("students/sendRequest");
});
router.get("/get-teacher", ensureStudent, async (req, res) => {
  // const {studentId} = req.body;
  const studentId = req.user.id;
  try {
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "student not found" });
    }

    const students = Object.values(student.teachers);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

router.post("/acceptRequest",ensureStudent, async (req, res) => {
  const { teacherId } = req.body;
  const studentId = req.user.id;

  const result = await addTeacher(studentId, teacherId, "teacher");

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(404).json({ message: result.message });
  }
});

router.post("/rejectRequest", ensureStudent, async (req, res) => {
  try {
    const { teacherId } = req.body;
    const studentId = req.user.id;
    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) throw new Error("Teacher not found");

    const student = await User.findOne({ _id: studentId, role: "student" });
    if (!student) throw new Error("Student not found");

    teacher.requests.sent.pull(studentId);
    student.requests.received.pull(teacherId);
    await teacher.save();
    await student.save();

    return res.status(200).json({ message: "rejected request successfully" });
  } catch (err) {
    return res.status(404).send({ error: err.message });
  }
});

router.get("/getQuiz/:id",ensureStudent, async (req, res) => {
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/submitquiz",ensureStudent, async (req, res) => {
    try {
      const { quizId, response } = req.body;
      const userId = req.user.id;
      if (!quizId) throw new Error("Invalid quiz Id");
  
      const quiz = await Quiz.findById(quizId);
      if (!quiz) throw new Error("Quiz not found");

      if (response.length !== quiz.questions.length) {
        throw new Error("Number of responses does not match the number of questions");
      }
      const score = calculateScore(quiz.questions, response);

      const user = await User.findById(userId);
      // console.log(user);

      const existingSubmission = user.quizScores.some((submission) => submission.quiz.equals(quiz._id));

      if (existingSubmission) {
        return res.status(400).send({ error: "You have already submitted this quiz" });
      }
      console.log("Not exist")
      const newQuiz = {
        quiz: quiz._id,
        score: score,
        response: response,
        submittedAt: new Date(),
      };
      user.quizScores = [ ...user.quizScores, newQuiz];
      console.log(user);
      await user.save();

      return res.status(200).send({ message: "Quiz submitted successfully", score: score });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  });
  
  function calculateScore(questions, userResponses) {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userResponses[i] === questions[i].options[questions[i].correctOptionIndex]) {
        score++;
      }
    }
    return score;
  }

module.exports = router;
