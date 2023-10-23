import { io } from "socket.io-client";

const joinRoomButton = document.getElementById("room-button");
const messageInput = document.getElementById("message-input");
const roomInput = document.getElementById("room-input");
const form = document.getElementById("form");

const teacherList = document.getElementById("teacher-list");
const messageContainer = document.getElementById("message-container");

let selectedTeacherId = "";

const API_LINK = "https://webar-um2g.onrender.com";

// Fetch the student list
fetch(`${API_LINK}/students/get-teacher`)
  .then((response) => response.json())
  .then((teachers) => {
    teachers.forEach((teacher) => {
      const listItem = document.createElement("li");
      listItem.textContent = teacher.name;
      listItem.dataset.teacherId = teacher.id;
      listItem.classList.add("teacher-item");
      teacherList.appendChild(listItem);
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
          !(message.sender === selectedTeacherId)
        );
      });
    });
}

// Handle student click event
teacherList.addEventListener("click", (event) => {
  const clickedItem = event.target.closest(".teacher-item");
  if (clickedItem) {
    // Remove active class from all items
    const allStudentItems = document.querySelectorAll(".teacher-item");
    allStudentItems.forEach((item) => {
      item.classList.remove("active-student");
    });

    // Add active class to the clicked item
    clickedItem.classList.add("active-student");
    selectedTeacherId = clickedItem.dataset.teacherId;
    fetchMessages(selectedTeacherId);
  }
});

const socket = io(`${API_LINK}`, { withCredentials: true });
socket.on("connect", () => {
  // document.getElementById("connection_id").innerHTML = socket.id;
  // console.log();
  // const userId = socket.request.user.id;
  const message = "Hii";
  socket.on("recieve-message", (message) => {
    if (!(message.sender === selectedTeacherId)) return;
    displayMessage(message.message, false);
  });
  socket.emit("join-room", (userId) => {
    const div = document.getElementById("self-id");
    div.innerHTML = "My Id: '" + userId + "'";
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = selectedTeacherId;

  if (message === "") return;
  if (room === "") return;
  displayMessage(message, true);
  socket.emit("send-message-s", message, room);
  messageInput.value = "";
});

function displayMessage(message, isSelf) {
  const div = document.createElement("div");
  div.textContent = message;
  if (isSelf) div.classList.add("self-message");
  document.getElementById("message-container").append(div);
}
