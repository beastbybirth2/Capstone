// server.js

// Require dependencies
const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const connectDB = require("./config/db");
const expressSession = require("express-session");
const io = require("socket.io");
const http = require("http");
const { initializingPassport, isAuthenticated } = require("./config/passport");
const Message = require("./models/message");
const cors = require('cors');


const API_LINK = "https://webar-um2g.onrender.com";
//creating the socket server
const server = http.createServer(app);
const sessionMiddleware = session({
  secret: "changeit",
  resave: false,
  saveUninitialized: false,
});

//initialise passport
initializingPassport(passport);

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

// Load environment variables from .env file
dotenv.config();

//connect to database
connectDB();

// Middleware for parsing request bodies and handling sessions
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());

// Set the view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets from the public folder
app.use(express.static(path.join(__dirname, "/public")));
app.use(morgan("tiny"));

// Routes
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const registerRoutes = require("./routes/registerRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Use the routes
app.use("/teachers", teacherRoutes);
app.use("/students", studentRoutes);
app.use("/auth", authRoutes);
app.use("/register", registerRoutes);
app.use("/message", messageRoutes);

/* some functions */
const isTeacher = (req, res) => {
  if (req.isAuthenticated()) {
    return req.user.role === "teacher";
  } else res.redirect("/auth/login");
};
/* Actual endpoints */

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/welcome", (req, res) => {
  if (!req.isAuthenticated()) return res.render("login");

  if (req.user.role === "teacher") {
    console.log("teacher logged");
    res.redirect("teachers/welcome");
  } else if (req.user.role === "student") {
    console.log("student logged");
    res.render("students/welcome");
  } else res.render("login");
});

const socketIoServer = io(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

const saveMessage = (sender, reciever, content) => {
  const newMessage = new Message({
    sender,
    reciever,
    content,
  });
  newMessage
    .save()
    .then((savedMessage) => {
      console.log("Message saved:", savedMessage);
    })
    .catch((error) => {
      console.error("Error saving message:", error);
    });
};
socketIoServer.use(wrap(sessionMiddleware));
socketIoServer.use(wrap(passport.initialize()));
socketIoServer.use(wrap(passport.session()));

socketIoServer.on("connect", (socket) => {
  // console.log(socket);
  socket.on("join-room", (callback) => {
    if (!socket.request.user) return;
    userId = socket.request.user.id;
    console.log(userId);
    socket.join(userId);
    callback(userId);
  });

  socket.on("send-message-t", (message, room) => {
    if (!socket.request.user.id && !(socket.request.user.role === "teacher"))
      return;
    sender = socket.request.user.id;
    socket.to(room).emit("recieve-message", {message: message, sender: socket.request.user.id});
    console.log(message);
    saveMessage(sender, room, message);
  });
  socket.on("send-message-s", (message, room) => {
    if (!socket.request.user.id || !(socket.request.user.role === "student"))
      return;
    sender = socket.request.user.id;
    socket.to(room).emit("recieve-message", message);
    console.log(message);
    saveMessage(sender, room, message);
  });
});
// Start the server
const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {console.log("listening on port")});
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
