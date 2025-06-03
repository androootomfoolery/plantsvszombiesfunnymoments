// ────────── calendar.js ──────────

// 1) State Variables
let monthKeys = [];
let currentMonthIndex = 0;
let allPlaylistsData = [];
let groupedByDate = {};

// 2) Once the page’s DOM is ready, fetch history.json & wire up arrows
document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  // 2a) Load history.json
  fetch("history.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} – could not load history.json`);
      return res.json();
    })
    .then((data) => {
      allPlaylistsData = data;

      // Flatten all snapshots & tag with playlistId/name
      const allSnapshots = data.flatMap((pl) =>
        pl.snapshots.map((snap) => ({
          playlistId: pl.playlistId,
          playlistName: pl.name,
          ...snap,
        }))
      );

      // Group by “YYYY-MM-DD”
      groupedByDate = allSnapshots.reduce((acc, snap) => {
        if (!acc[snap.date]) acc[snap.date] = [];
        acc[snap.date].push(snap);
        return acc;
      }, {});

      // Build unique “YYYY-MM” month keys, sort newest → oldest
      monthKeys = Array.from(
        new Set(Object.keys(groupedByDate).map((d) => d.slice(0, 7)))
      ).sort((a, b) => (a < b ? 1 : -1));

      currentMonthIndex = 0;
      renderCurrentMonth();
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("calendar-placeholder").innerHTML =
        '<div class="no-snapshots">Failed to load data.</div>';
      document.getElementById("month-display").textContent = "—";
    });

  // 2b) Hook up the left/right arrow buttons
  prevBtn.addEventListener("click", () => {
    if (!monthKeys.length) return;
    currentMonthIndex = (currentMonthIndex + 1) % monthKeys.length;
    renderCurrentMonth();
  });

  nextBtn.addEventListener("click", () => {
    if (!monthKeys.length) return;
    currentMonthIndex = (currentMonthIndex - 1 + monthKeys.length) % monthKeys.length;
    renderCurrentMonth();
  });
});

// 3) Renders the calendar for the current monthKey
function renderCurrentMonth() {
  const placeholder = document.getElementById("calendar-placeholder");
  placeholder.innerHTML = ""; // clear old content

  if (!monthKeys.length) {
    placeholder.innerHTML = '<div class="no-snapshots">No snapshots yet.</div>';
    document.getElementById("month-display").textContent = "—";
    return;
  }

  const monthKey = monthKeys[currentMonthIndex]; // e.g. "2025-06"
  const [yearStr, monthStr] = monthKey.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  // Update the “June 2025” label
  const humanMonth = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  document.getElementById("month-display").textContent = humanMonth;

  // Build a <table> for this month
  const table = document.createElement("table");
  table.className = "calendar-table";

  // 3a) Header row (Sun Mon Tue … Sat)
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((dow) => {
    const th = document.createElement("th");
    th.textContent = dow;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // 3b) Body rows (up to 6 weeks)
  const tbody = document.createElement("tbody");
  const lastDay = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  let currentDay = 1;
  let done = false;

  for (let week = 0; week < 6 && !done; week++) {
    const tr = document.createElement("tr");

    for (let dow = 0; dow < 7; dow++) {
      const td = document.createElement("td");

      // If we haven’t reached day 1 of the month yet
      if (week === 0 && dow < firstWeekday) {
        tr.appendChild(td);
        continue;
      }

      // If we have passed the last day of this month
      if (currentDay > lastDay) {
        tr.appendChild(td);
        done = true;
        continue;
      }

      // Otherwise, show the day number in chalk style
      const dn = document.createElement("div");
      dn.className = "day-number";
      dn.textContent = currentDay;
      td.appendChild(dn);

      // Build “YYYY-MM-DD”
      const dayStr = String(currentDay).padStart(2, "0");
      const fullDate = `${yearStr}-${monthStr}-${dayStr}`;

      // If there are snapshots that day, highlight and attach click
      if (groupedByDate[fullDate]) {
        td.classList.add("has-snapshot");
        td.onclick = () => {
          showSnapshotsForDate(fullDate, groupedByDate[fullDate], allPlaylistsData);
          document.getElementById("details").scrollIntoView({ behavior: "smooth" });
        };
      }

      tr.appendChild(td);
      currentDay++;
    }
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  document.getElementById("calendar-placeholder").appendChild(table);
}

// 4) When a date cell is clicked, show its snapshots
function showSnapshotsForDate(date, snapsOnDate, allPlaylistsData) {
    const detailsDiv = document.getElementById("details");
    detailsDiv.innerHTML = "";
  
    const heading = document.createElement("h1");
    heading.textContent = formatDateShort(date);
    heading.className = "details-heading";
    detailsDiv.appendChild(heading);
  
    const playlistMap = {};
  
    for (const snap of snapsOnDate) {
      if (!playlistMap[snap.playlistId]) {
        playlistMap[snap.playlistId] = {
          name: snap.playlistName,
          snapshots: [],
        };
      }
      playlistMap[snap.playlistId].snapshots.push(snap);
    }
  
    const wrapper = document.createElement("div");
    wrapper.className = "playlist-columns-wrapper";
  
    for (const playlistId in playlistMap) {
      const column = document.createElement("div");
      column.className = "playlist-column";
  
      const title = document.createElement("h2");
      title.textContent = playlistMap[playlistId].name;
      column.appendChild(title);
  
      for (const snap of playlistMap[playlistId].snapshots) {
        const tile = document.createElement("div");
        tile.className = "snapshot";
  
        const time = document.createElement("div");
        time.className = "timestamp";
        time.textContent = new Date(snap.timestamp).toLocaleTimeString();
  
        const desc = document.createElement("div");
        desc.className = "description";
        desc.textContent = snap.description || "(no description)";
  
        const img = document.createElement("img");
        img.src = snap.imageUrl;
        img.alt = "Cover art";
  
        tile.appendChild(time);
        tile.appendChild(desc);
        tile.appendChild(img);
  
        column.appendChild(tile);
      }
  
      wrapper.appendChild(column);
    }
  
    detailsDiv.appendChild(wrapper);
  }
  


// Helper: Convert “YYYY-MM-DD” → “M/D/YY”
function formatDateShort(dateStr) {
  const [YYYY, MM, DD] = dateStr.split("-");
  const m = parseInt(MM, 10);
  const d = parseInt(DD, 10);
  const y2 = YYYY.slice(2);
  return `${m}/${d}/${y2}`;
}
