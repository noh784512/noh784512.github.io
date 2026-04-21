const DATA_FILES = [
  { key: "kata",       file: "data/kata.json",       label: "KATA" },
  { key: "kato",       file: "data/kato.json",       label: "KATO" },
  { key: "tennistown", file: "data/tennistown.json", label: "테니스타운" },
];

const state = {
  datasets: {},
  loaded: false,
};

async function loadAllData() {
  const results = await Promise.all(
    DATA_FILES.map(async ({ key, file }) => {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`${file} 로드 실패 (${res.status})`);
      const json = await res.json();
      return [key, json];
    })
  );
  state.datasets = Object.fromEntries(results);
  state.loaded = true;

  const dates = Object.values(state.datasets)
    .map((d) => d.last_updated)
    .filter(Boolean);
  if (dates.length) {
    document.getElementById("lastUpdated").textContent =
      `최종 업데이트: ${dates.sort().slice(-1)[0]}`;
  }
}

function normalizeClub(name) {
  return name.replace(/\s+/g, "").toLowerCase();
}

function clubsOverlap(a, b) {
  const setA = new Set(a.map(normalizeClub));
  return b.some((c) => setA.has(normalizeClub(c)));
}

function findByName(name) {
  const needle = name.trim();
  if (!needle) return [];
  const hits = [];
  for (const { key } of DATA_FILES) {
    const ds = state.datasets[key];
    if (!ds) continue;
    for (const p of ds.players) {
      if (p.name === needle) {
        hits.push({ org: key, player: p });
      }
    }
  }
  return hits;
}

function groupByIdentity(hits) {
  const groups = [];
  for (const hit of hits) {
    let placed = false;
    for (const g of groups) {
      const overlaps = g.some((h) =>
        clubsOverlap(h.player.clubs, hit.player.clubs)
      );
      if (overlaps) {
        g.push(hit);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([hit]);
  }
  return groups;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function renderOrgSection(orgKey, hit) {
  const orgLabel = DATA_FILES.find((d) => d.key === orgKey).label;
  if (!hit) {
    return `
      <div class="org-section empty ${orgKey}">
        <div class="org-section-header">
          <span>${orgLabel}</span>
          <span class="org-rank-info">기록 없음</span>
        </div>
        <div class="org-body">
          <p class="empty-msg">이 선수의 ${orgLabel} 이력이 없습니다.</p>
        </div>
      </div>
    `;
  }

  const p = hit.player;
  const rankInfo = `${escapeHtml(p.category || p.type || "")} · ${p.rank}위 · ${p.points}pt`;
  const metaBits = [];
  if (p.tier) metaBits.push(`<span><strong>티어:</strong> ${escapeHtml(p.tier)}</span>`);
  if (p.match_count != null) metaBits.push(`<span><strong>출전:</strong> ${p.match_count}회</span>`);
  if (p.clubs?.length) metaBits.push(`<span><strong>소속:</strong> ${p.clubs.map(escapeHtml).join(", ")}</span>`);
  const metaRow = metaBits.length ? `<div class="meta-row">${metaBits.join("")}</div>` : "";

  const tourneys = (p.tournaments || [])
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((t) => `
      <li>
        <span class="tourney-date">${escapeHtml(t.date)}</span>
        <span class="tourney-name">${escapeHtml(t.name)} <small style="color:var(--text-muted)">(${escapeHtml(t.category || t.type || "")})</small></span>
        <span class="tourney-result">${escapeHtml(t.result)}${t.points_earned ? ` · +${t.points_earned}pt` : ""}</span>
      </li>
    `)
    .join("");

  const tourneyBlock = tourneys
    ? `<ul class="tournament-list">${tourneys}</ul>`
    : `<p class="empty-msg">대회 이력이 없습니다.</p>`;

  return `
    <div class="org-section ${orgKey}">
      <div class="org-section-header">
        <span>${orgLabel}</span>
        <span class="org-rank-info">${rankInfo}</span>
      </div>
      <div class="org-body">
        ${metaRow}
        ${tourneyBlock}
      </div>
    </div>
  `;
}

function renderPersonCard(group, splitIndex, totalSplits) {
  const name = group[0].player.name;
  const allClubs = Array.from(
    new Set(group.flatMap((h) => h.player.clubs || []))
  );
  const byOrg = Object.fromEntries(group.map((h) => [h.org, h]));
  const badge = totalSplits > 1
    ? `<span class="match-badge split">동명이인 후보 ${splitIndex + 1}/${totalSplits}</span>`
    : `<span class="match-badge">클럽 매칭</span>`;

  const sections = DATA_FILES
    .map(({ key }) => renderOrgSection(key, byOrg[key]))
    .join("");

  return `
    <article class="player-card">
      <header class="player-header">
        <h2 class="player-name">${escapeHtml(name)}</h2>
        <span class="player-clubs">${allClubs.map(escapeHtml).join(" · ")}</span>
        ${badge}
      </header>
      <div class="org-sections">${sections}</div>
    </article>
  `;
}

function render(name) {
  const resultsEl = document.getElementById("results");
  const statusEl = document.getElementById("status");
  resultsEl.innerHTML = "";
  statusEl.classList.remove("error");

  if (!state.loaded) {
    statusEl.textContent = "데이터를 아직 불러오지 못했습니다.";
    return;
  }

  const hits = findByName(name);
  if (hits.length === 0) {
    statusEl.textContent = `"${name}" 선수의 기록을 찾을 수 없습니다.`;
    return;
  }

  const groups = groupByIdentity(hits);
  statusEl.textContent =
    groups.length === 1
      ? `"${name}" 선수 1명의 이력을 찾았습니다.`
      : `"${name}" 이름으로 ${groups.length}명의 후보를 찾았습니다 (클럽이 겹치지 않아 분리됨).`;

  resultsEl.innerHTML = groups
    .map((g, i) => renderPersonCard(g, i, groups.length))
    .join("");
}

function handleSearch() {
  const input = document.getElementById("searchInput");
  render(input.value);
}

document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  try {
    statusEl.textContent = "데이터 불러오는 중...";
    await loadAllData();
    statusEl.textContent = "이름을 입력하고 검색하세요. (샘플: 홍길동, 김철수, 박민수, 이준호, 최현우)";
  } catch (err) {
    statusEl.classList.add("error");
    statusEl.textContent = `데이터 로드 실패: ${err.message}`;
    return;
  }

  document.getElementById("searchButton").addEventListener("click", handleSearch);
  document.getElementById("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
});
