const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Logout route
router.get("/logout", authController.logout);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", authController.login, (req, res, next) => {
  const { Srole } = req.body;

  if (!(Srole === req.user.role)) {
    console.log("Unauthorised");
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.status(401).send("Credentials don't match");
    });
  } else {
    res.redirect("/welcome");
  }
});

// Protected route example
router.get(
  "/profile",
  authController.ensureAuthenticated,
  authController.profile
);

module.exports = router;
