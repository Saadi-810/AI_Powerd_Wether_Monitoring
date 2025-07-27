const dashboardTab = document.getElementById("dashboard-tab");
const chatTab = document.getElementById("chat-tab");
const dashboard = document.getElementById("dashboard");
const chat = document.getElementById("chat");
const input = document.getElementById("message-input");
const mockWarning = document.getElementById("mock-warning");

dashboardTab.addEventListener("click", () => {
  dashboard.classList.add("active");
  chat.classList.remove("active");
  dashboardTab.classList.add("active");
  chatTab.classList.remove("active");
});

chatTab.addEventListener("click", () => {
  chat.classList.add("active");
  dashboard.classList.remove("active");
  chatTab.classList.add("active");
  dashboardTab.classList.remove("active");
});

const tempChart = new Chart(document.getElementById("tempChart").getContext("2d"), {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Temperature (°C)",
      data: [],
      borderColor: "#fff",
      backgroundColor: "rgba(50, 50, 50, 0.5)",
      fill: true,
    }]
  },
  options: {
    scales: {
      y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
      x: { ticks: { color: "#fff" }, grid: { color: "#333" } },
    },
    plugins: { legend: { labels: { color: "#fff" } } },
    responsive: true,
    maintainAspectRatio: false,
  }
});

const humChart = new Chart(document.getElementById("humChart").getContext("2d"), {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Humidity (%)",
      data: [],
      borderColor: "#aaa",
      backgroundColor: "rgba(50, 50, 50, 0.5)",
      fill: true,
    }]
  },
  options: {
    scales: {
      y: { ticks: { color: "#fff" }, grid: { color: "#333" } },
      x: { ticks: { color: "#fff" }, grid: { color: "#333" } },
    },
    plugins: { legend: { labels: { color: "#fff" } } },
    responsive: true,
    maintainAspectRatio: false,
  }
});

function updateCharts() {
  fetch("/data")
    .then((res) => res.json())
    .then((data) => {
      tempChart.data.labels = data.timestamps;
      tempChart.data.datasets[0].data = data.temperatures;
      humChart.data.labels = data.timestamps;
      humChart.data.datasets[0].data = data.humidity;
      tempChart.update();
      humChart.update();

      const tbody = document.querySelector("#data-table tbody");
      tbody.innerHTML = "";
      for (let i = data.timestamps.length - 1; i >= 0; i--) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${data.timestamps[i]}</td>
          <td style="text-align: right;">${data.temperatures[i]}</td>
          <td style="text-align: right;">${data.humidity[i]}</td>
        `;
        tbody.appendChild(row);
      }
    })
    .catch((err) => {
      console.error("Error fetching data:", err);
    });
}

setInterval(updateCharts, 15000);
updateCharts();

const messages = document.getElementById("messages");

function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;
  appendMessage("user", msg);
  input.value = "";

  fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Chat request failed");
      return res.json();
    })
    .then((data) => {
      appendMessage("bot", data.reply || "[No response]");
    })
    .catch((err) => {
      console.error("Chat error:", err);
      appendMessage("bot", "[Error contacting Mistral API]");
    });
}

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.innerHTML = marked.parse(text);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("send-button").addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
