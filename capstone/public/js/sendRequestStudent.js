const API_LINK = "https://webar-um2g.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  const sendRequestButton = document.getElementById("sendRequestButton");
  const friendRequestsList = document.getElementById("request_list");

  sendRequestButton.addEventListener("click", async () => {
    const receiverId = document.getElementById("receiverId").value;

    if (!receiverId) {
      alert("Please provide receiver IDs.");
      return;
    }

    try {
      const response = await fetch(`${API_LINK}/message/friendrequestsend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ receiverId:receiverId }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send friend request: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("An error occurred:", error.message);
      window.alert("Couldn't send friend request");
    }
  });

  const getRequest = async () => {
    const response = await fetch(`${API_LINK}/message/friendrequestrec`);
    const data = await response.json();
    return data;
  };
  const acceptRequest = async (listItem) => {
    try {
      const id = listItem.getAttribute("id");
      const response = await fetch(`${API_LINK}/students/acceptRequest`, {
        method: "POST",
        body: JSON.stringify({ teacherId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      const acceptButton = listItem.querySelector(".accept");
      acceptButton.innerHTML = "Accepted";
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
      const response = await fetch(`${API_LINK}/students/rejectRequest`, {
        method: "POST",
        body: JSON.stringify({ teacherId: id }), 
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
