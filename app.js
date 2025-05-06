let scheduleData = {};

async function loadSchedule() {
  const res = await fetch("schedule.json");
  scheduleData = await res.json();
  populateStops(Object.keys(scheduleData));
}

function populateStops(stops) {
  const select = document.getElementById("stop-select");
  stops.forEach(stop => {
    const option = document.createElement("option");
    option.value = stop;
    option.textContent = stop;
    select.appendChild(option);
  });

  select.addEventListener("change", updateSchedule);
  updateSchedule(); // 初期表示
}

function updateSchedule() {
  const stop = document.getElementById("stop-select").value;
  const schedule = scheduleData[stop] || [];

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  document.getElementById("now-time").textContent = `現在時刻：${nowStr}`;

  const upcoming = schedule.filter(({ time }) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m >= nowMins;
  });

  const list = document.getElementById("bus-list");
  list.innerHTML = "";
  if (upcoming.length === 0) {
    list.innerHTML = "<li>出発予定のバスはありません。</li>";
    return;
  }

  upcoming.forEach(({ time, destination }) => {
    const li = document.createElement("li");
    li.textContent = `${time} 発 → ${destination}`;
    list.appendChild(li);
  });
}

loadSchedule();
