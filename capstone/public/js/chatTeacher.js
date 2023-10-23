import { io } from "socket.io-client";

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const studentList = document.getElementById("student-list");
const messageContainer = document.getElementById("message-container");

let selectedStudentId = "";

const API_LINK = "https://webar-um2g.onrender.com";

// Fetch the student list
fetch(`${API_LINK}/teachers/get-student`)
  .then((response) => response.json())
  .then((students) => {
    students.forEach((student) => {
      const listItem = document.createElement("li");
      listItem.textContent = student.name;
      listItem.dataset.studentId = student.id;
      listItem.classList.add("student-item");
      studentList.appendChild(listItem);
    });
  });

function fetchMessages(room) {
  // Fetch messages for the selected chat (room) and display them in the message container
  fetch(`${API_LINK}/message/chat?senderId=${room}`)
    .then((response) => response.json())
    .then((messages) => {
      messageContainer.innerHTML = ""; // Clear existing messages
      messages.forEach((message) => {
        displayMessage(
          message.content,
          !(message.sender === selectedStudentId)
        );
      });
    });
}

// Handle student click event
studentList.addEventListener("click", (event) => {
  const clickedItem = event.target.closest(".student-item");
  if (clickedItem) {
    // Remove active class from all items
    const allStudentItems = document.querySelectorAll(".student-item");
    allStudentItems.forEach((item) => {
      item.classList.remove("active-student");
    });

    // Add active class to the clicked item
    clickedItem.classList.add("active-student");
    selectedStudentId = clickedItem.dataset.studentId;
    fetchMessages(selectedStudentId);
  }
});

const socket = io(`${API_LINK}`, { withCredentials: true });
socket.on("connect", () => {
  // document.getElementById("connection_id").innerHTML = socket.id;
  // console.log();
  // const userId = socket.request.user.id;
  const message = "Hii";
  socket.emit("join-room", (userId) => {
    const div = document.getElementById("self-id");
    div.innerHTML = "My Id: '" + userId + "'";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  socket.emit("get-id");
  const message = messageInput.value;
  const room = selectedStudentId;

  if (message === "") return;
  if (room === "") return;
  displayMessage(message, true);
  socket.emit("send-message-t", message, room);
  messageInput.value = "";
});

socket.on("recieve-message", (message) => {
  if (!(message.sender === selectedStudentId)) return;
  displayMessage(message.message, false);
});

function displayMessage(message, isSelf) {
  const div = document.createElement("div");
  div.textContent = message;
  if (isSelf) div.classList.add("self-message");
  document.getElementById("message-container").append(div);
}
