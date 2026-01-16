// Client: fetch the canonical scores file and render sorted rounded cards.
// Assumes data/scores.json exists in the repo (served by GitHub Pages)

const REPO_OWNER = "blxssoms";
const REPO_NAME = "blxssoms.github.io";
const FILE_PATH = "data/scores.json"; // relative to repo root

function escapeHtml(s) {
  return String(s).replace(/[&<>\"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]);
}

async function fetchScores() {
  try {
    // Fetch the file from the same site (served by GitHub Pages)
    const resp = await fetch(`/${FILE_PATH}`, { cache: "no-store" });
    if (!resp.ok) {
      throw new Error(`Failed to load scores (${resp.status})`);
    }
    const json = await resp.json();
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error(err);
    return null;
  }
}

function renderList(people) {
  const listEl = document.getElementById("people-list");
  const emptyText = document.getElementById("empty-text");
  listEl.innerHTML = "";
  if (!people || people.length === 0) {
    emptyText.textContent = "No people yet.";
    return;
  }
  emptyText.textContent = "";

  // Sort highest -> lowest
  people.sort((a,b) => Number(b.score) - Number(a.score));

  people.forEach(p => {
    const card = document.createElement("div");
    card.className = "person-card";
    card.innerHTML = `
      <div class="person-info">
        <div class="person-name">${escapeHtml(p.name)}</div>
        <div class="person-score">Score: ${escapeHtml(String(p.score))}</div>
      </div>
    `;
    listEl.appendChild(card);
  });
}

async function refresh() {
  document.getElementById("empty-text").textContent = "Loading...";
  const people = await fetchScores();
  if (people === null) {
    document.getElementById("empty-text").textContent = "Failed to load scores.";
    return;
  }
  renderList(people);
}

// "Edit on GitHub" link: opens the GitHub web editor for the file.
// When you (the owner) click it you can commit directly to main.
document.getElementById("edit-on-github").href =
  `https://github.com/${REPO_OWNER}/${REPO_NAME}/edit/main/${FILE_PATH}`;

window.addEventListener('load', refresh);