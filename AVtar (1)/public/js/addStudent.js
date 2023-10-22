const studentName = document.getElementById("studentName");
const studentId = document.getElementById("studentId");
const friendRequestsList = document.getElementById("request_list");

document.addEventListener("DOMContentLoaded", () => {
  const addStudentForm = document.getElementById("addStudentForm");

  addStudentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentEmail = document.getElementById("studentEmail").value;

    if (!studentEmail) {
      alert("Please fill in both student name and ID.");
      return;
    }

    const requestData = {
      receiverEmail: studentEmail,
    };

    try {
      const response = await fetch("/message/friendrequestsend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Requesst sent successfully");
        document.getElementById("studentEmail").value = "";
      } else {
        alert("error adding student");
      }
    } catch (e) {
      console.log(e);
    }
  });

  const getRequest = async () => {
    const response = await fetch("/message/friendrequestrec");
    const data = await response.json();
    return data;
  };

  const acceptRequest = async (listItem) => {
    try {
      const id = listItem.getAttribute("id");
      const response = await fetch("/teachers/acceptRequest", {
        method: "POST",
        body: JSON.stringify({ studentId: id }), 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Request failed');
      }
  
      const data = await response.json();
      const acceptButton = listItem.querySelector(".accept")
      acceptButton.innerHTML = "Accepted"
      acceptButton.disabled = true;
      const rejectButton = listItem.querySelector(".reject");
      rejectButton.remove();
      window.alert("Accepted request");
      return;
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  
  const rejectRequest = async (listItem) => {
    try {
      const id = listItem.getAttribute("id");
      const response = await fetch("/teachers/rejectRequest", {
        method: "POST",
        body: JSON.stringify({ studentId: id }), 
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Request failed');
      }
  
      const data = await response.json();
      const rejectButton = listItem.querySelector(".reject")
      rejectButton.innerHTML = "Rejected"
      rejectButton.disabled = true;
      const acceptButton = listItem.querySelector(".accept");
      acceptButton.remove();
      window.alert("Rejected request");
      return;
    } catch (error) {
      console.error("Error Rejecting request:", error);
    }
  };

  const createFriendRequestListItem = (request) => {
    const listItem = document.createElement("div");
    listItem.classList.add("request");
    listItem.setAttribute("id", request._id);
    listItem.innerHTML = `
      <span>${request.name} sent you a friend request.</span>
      <button class="accept">Accept</button>
      <button class="reject">Reject</button>
    `;

    listItem.querySelector(".accept").addEventListener("click", async () => {
      acceptRequest(listItem);
    });

    listItem.querySelector(".reject").addEventListener("click", async () => {
      rejectRequest(listItem);
    });

    friendRequestsList.appendChild(listItem);
  };

  getRequest()
    .then((friendRequests) => {
      const friendRequestsArr = friendRequests.receivedRequests;
      // console.log(friendRequests.receivedRequests)
      friendRequestsArr.forEach(createFriendRequestListItem);
    })
    .catch((error) => {
      console.error("Error fetching friend requests:", error);
    });
});
