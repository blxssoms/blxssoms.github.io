// Simple client-side storage for demo purposes
// Each person: { id, name, score }

const STORAGE_KEY = "people_scores";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function loadPeople() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePeople(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}

function renderList() {
  const listEl = document.getElementById("people-list");
  const emptyText = document.getElementById("empty-text");
  const people = loadPeople();

  // sort highest -> lowest (highest first, lowest last)
  people.sort((a, b) => Number(b.score) - Number(a.score));

  listEl.innerHTML = "";
  if (!people.length) {
    emptyText.style.display = "block";
    return;
  }
  emptyText.style.display = "none";

  people.forEach(p => {
    const card = document.createElement("div");
    card.className = "person-card";

    const info = document.createElement("div");
    info.className = "person-info";
    info.innerHTML = `
      <div class="person-name">${escapeHtml(p.name)}</div>
      <div class="person-score">Score: ${escapeHtml(String(p.score))}</div>
    `;

    const actions = document.createElement("div");
    actions.className = "person-actions";

    const viewBtn = document.createElement("button");
    viewBtn.textContent = "View";
    viewBtn.addEventListener("click", () => showDetail(p.id));
    actions.appendChild(viewBtn);

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(p.id));
    actions.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      if (!confirm(`Delete ${p.name}?`)) return;
      const newList = loadPeople().filter(x => x.id !== p.id);
      savePeople(newList);
      renderList();
    });
    actions.appendChild(delBtn);

    card.appendChild(info);
    card.appendChild(actions);
    listEl.appendChild(card);
  });
}

function startEdit(id) {
  const people = loadPeople();
  const p = people.find(x => x.id === id);
  if (!p) return;
  document.getElementById("name").value = p.name;
  document.getElementById("score").value = p.score;
  document.getElementById("editing-id").value = p.id;
  location.hash = "#add-person";
}

function showDetail(id) {
  const people = loadPeople();
  const p = people.find(x => x.id === id);
  if (!p) return;
  const detailSection = document.getElementById("detail");
  const detailContent = document.getElementById("detail-content");
  detailSection.style.display = "block";
  detailContent.innerHTML = `<p><strong>${escapeHtml(p.name)}</strong></p><p>Score: ${escapeHtml(String(p.score))}</p>`;
  detailSection.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("person-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const score = Number(document.getElementById("score").value);
  const editingId = document.getElementById("editing-id").value;
  if (!name) return alert("Name required");
  if (Number.isNaN(score)) return alert("Score must be a number");
  const people = loadPeople();
  if (editingId) {
    const idx = people.findIndex(x => x.id === editingId);
    if (idx !== -1) {
      people[idx].name = name;
      people[idx].score = score;
    }
  } else {
    people.push({ id: uid(), name, score });
  }
  savePeople(people);
  document.getElementById("person-form").reset();
  document.getElementById("editing-id").value = "";
  renderList();
  document.getElementById("scores").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("clear-form").addEventListener("click", () => {
  document.getElementById("person-form").reset();
  document.getElementById("editing-id").value = "";
});

document.getElementById("go-scores").addEventListener("click", () => {
  document.getElementById("scores").scrollIntoView({ behavior: "smooth" });
});

// initial render
renderList();
