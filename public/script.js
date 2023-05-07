const dateToAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 24) {
        return `${Math.floor(hours / 24)} days ago`;
    } else if (hours > 0) {
        return `${hours} hours ago`;
    } else if (minutes > 0) {
        return `${minutes} minutes ago`;
    } else {
        return `${seconds} seconds ago`;
    }
};

// get messages from API
const getMessages = () => {
  fetch("/posts")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("messages").innerHTML = "";
      data.forEach((item) => {
        const root = document.createElement("div");
        const date = new Date(item.date);
        root.innerHTML = `<span class="name">${item.name}</span><span class="date">${dateToAgo(date)}</span><p>${item.message}</p>`;
        root.classList.add("message");
        document.getElementById("messages").appendChild(root);
      });
    });
};

// post message to API
const postMessage = (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  fetch("/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      getMessages();
    });
};

// get messages from API on page load
document.addEventListener("DOMContentLoaded", getMessages);
