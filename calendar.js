// ────────── 1) STATE VARIABLES ──────────
let monthKeys = [];              
let currentMonthIndex = 0;       
let allPlaylistsData = [];       
let groupedByDate = {};          


document.addEventListener("DOMContentLoaded", () => {
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  // ─── 2) LOAD history.json ───
  fetch("history.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} – could not load history.json`);
      }
      return res.json();
    })
    .then(data => {
      allPlaylistsData = data;

      // Flatten & group all snapshots by date "YYYY-MM-DD"
      const allSnapshots = data.flatMap(pl =>
        pl.snapshots.map(snap => ({
          playlistId: pl.playlistId,
          playlistName: pl.name,
          ...snap
        }))
      );
      groupedByDate = allSnapshots.reduce((acc, snap) => {
        if (!acc[snap.date]) acc[snap.date] = [];
        acc[snap.date].push(snap);
        return acc;
      }, {});

      // Extract unique “YYYY-MM” keys, sort newest-first
      monthKeys = Array.from(
        new Set(Object.keys(groupedByDate).map(d => d.slice(0, 7)))
      ).sort((a, b) => (a < b ? 1 : -1));

      // Show the first (newest) month immediately
      currentMonthIndex = 0;
      renderCurrentMonth();
    })
    .catch(err => {
      console.error(err);
      document.getElementById("calendar-placeholder").innerHTML =
        '<div class="no-snapshots">Failed to load data.</div>';
      document.getElementById("month-display").textContent = "—";
    });

  // ─── 3) WIRE UP ARROW BUTTONS ───
  prevBtn.addEventListener("click", () => {
    console.log("◀ clicked; currentMonthIndex was", currentMonthIndex);
    if (!monthKeys.length) return;
    currentMonthIndex = (currentMonthIndex + 1) % monthKeys.length;
    console.log("◀ updated currentMonthIndex to", currentMonthIndex);
    renderCurrentMonth();
  });
  
  nextBtn.addEventListener("click", () => {
    console.log("▶ clicked; currentMonthIndex was", currentMonthIndex);
    if (!monthKeys.length) return;
    currentMonthIndex = (currentMonthIndex - 1 + monthKeys.length) % monthKeys.length;
    console.log("▶ updated currentMonthIndex to", currentMonthIndex);
    renderCurrentMonth();
  });
});


// ────────── 4) RENDER A GIVEN MONTH AS A TABLE ──────────
function renderCurrentMonth() {
  const placeholder = document.getElementById("calendar-placeholder");
  placeholder.innerHTML = ""; // clear previous calendar or message

  if (!monthKeys.length) {
    placeholder.innerHTML = '<div class="no-snapshots">No snapshots yet.</div>';
    document.getElementById("month-display").textContent = "—";
    return;
  }

  // Which monthKey are we on? (e.g. "2025-06")
  const monthKey = monthKeys[currentMonthIndex];
  const [yearStr, monthStr] = monthKey.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10); // 1-based

  // Update the “June 2025” (for example) text
  const humanMonth = new Date(year, month - 1).toLocaleString("default", {
    month: "long",
    year: "numeric"
  });
  
  document.getElementById("month-display").textContent = humanMonth;

  // Build a <table> for that month
  const table = document.createElement("table");
  table.className = "calendar-table";

  // Header row: Sun, Mon, Tue, Wed, Thu, Fri, Sat
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach(dow => {
    const th = document.createElement("th");
    th.textContent = dow;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Body: up to 6 weeks
  const tbody = document.createElement("tbody");
  const lastDay = new Date(year, month, 0).getDate();          // e.g. 30
  const firstWeekday = new Date(year, month - 1, 1).getDay();   // 0=Sun…6=Sat

  let currentDay = 1;
  let done = false;
  for (let week = 0; week < 6 && !done; week++) {
    const tr = document.createElement("tr");
    for (let dow = 0; dow < 7; dow++) {
      const td = document.createElement("td");

      // Before day 1 appears (first row)
      if (week === 0 && dow < firstWeekday) {
        tr.appendChild(td);
        continue;
      }

      // After lastDay, leave blank
      if (currentDay > lastDay) {
        tr.appendChild(td);
        done = true;
        continue;
      }

      // Otherwise, put the day number inside
      const dn = document.createElement("div");
      dn.className = "day-number";
      dn.textContent = currentDay;
      td.appendChild(dn);

      // Full date string “YYYY-MM-DD”
      const dayStr = String(currentDay).padStart(2, "0");
      const fullDate = `${yearStr}-${monthStr}-${dayStr}`;

      // If there are snapshots for this date, outline it and make it clickable
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
  placeholder.appendChild(table);
}


// ────────── 5) WHEN A DATE IS CLICKED, SHOW SNAPSHOTS BELOW ──────────
function showSnapshotsForDate(date, snapsOnDate, allPlaylistsData) {
  const detailsDiv = document.getElementById("details");
  detailsDiv.innerHTML = ""; // clear old columns

  // Heading “Changes on M/D/YY”
  const heading = document.createElement("h1");
  heading.textContent = `Changes on ${formatDateShort(date)}`;
  heading.style.fontSize = "1.5rem";
  heading.style.marginBottom = "1rem";
  heading.style.textAlign = "center";
  heading.style.color = "#fff";
  heading.style.textShadow = "0 0 5px rgba(0,0,0,0.8)";
  detailsDiv.appendChild(heading);

  // Use the same playlist order that came from history.json
  const playlistOrder = allPlaylistsData.map(pl => pl.playlistId);

  playlistOrder.forEach(pid => {
    const col = document.createElement("div");
    col.className = "playlist-column";

    // Look up the playlist’s “name”
    const plObj = allPlaylistsData.find(pl => pl.playlistId === pid);
    const plName = plObj ? plObj.name : pid;

    // Title in a friendlier, hand-written font
    const title = document.createElement("h2");
    title.textContent = plName;
    col.appendChild(title);

    // Find snapshots for this playlist on that date:
    const snapsForThis = snapsOnDate.filter(snap => snap.playlistId === pid);

    if (!snapsForThis.length) {
      // If none, show “(no changes)”
      const noSnap = document.createElement("div");
      noSnap.className = "no-snapshots";
      noSnap.textContent = "(no changes)";
      col.appendChild(noSnap);
    } else {
      // Sort newest-first
      snapsForThis.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      snapsForThis.forEach(snap => {
        const snapDiv = document.createElement("div");
        snapDiv.className = "snapshot";

        // Timestamp
        const ts = document.createElement("div");
        ts.className = "timestamp";
        ts.textContent = new Date(snap.timestamp).toLocaleTimeString();
        snapDiv.appendChild(ts);

        // Description
        const desc = document.createElement("div");
        desc.className = "description";
        desc.innerHTML = snap.description ? snap.description : "<em>(no description)</em>";
        snapDiv.appendChild(desc);

        // Image (if present)
        if (snap.imageUrl) {
          const img = document.createElement("img");
          img.src = snap.imageUrl;
          img.alt = `Playlist image on ${formatDateShort(date)}`;
          snapDiv.appendChild(img);
        }

        col.appendChild(snapDiv);
      });
    }

    detailsDiv.appendChild(col);
  });
}

// ────────── HELPER: “YYYY-MM-DD” → “M/D/YY” ──────────
function formatDateShort(dateStr) {
  const [YYYY, MM, DD] = dateStr.split("-");
  const m = parseInt(MM, 10);
  const d = parseInt(DD, 10);
  const y2 = YYYY.slice(2);
  return `${m}/${d}/${y2}`;
}
