(() => {
  const THEMES = ["gallery", "notebook", "terminal"];
  const STORAGE_KEY = "choonsik-lab-theme";

  const STATUS_LABEL = {
    live: "Live",
    local: "Local",
    prototype: "Prototype",
    archived: "Archived",
  };

  const state = {
    lab: null,
    projects: [],
    category: "전체",
    query: "",
    sort: "newest",
    theme: "gallery",
  };

  const els = {
    html: document.documentElement,
    labTitle: document.getElementById("lab-title"),
    labSubtitle: document.getElementById("lab-subtitle"),
    labStats: document.getElementById("lab-stats"),
    categoryFilters: document.getElementById("category-filters"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    randomBtn: document.getElementById("random-btn"),
    projectList: document.getElementById("project-list"),
    emptyState: document.getElementById("empty-state"),
    resetFilterBtn: document.getElementById("reset-filter-btn"),
    themeBtns: document.querySelectorAll("[data-set-theme]"),
    footerRepo: document.getElementById("footer-repo"),
    footerGithub: document.getElementById("footer-github"),
    modal: document.getElementById("detail-modal"),
    modalClose: document.getElementById("modal-close"),
    modalMeta: document.getElementById("modal-meta"),
    modalVisual: document.getElementById("modal-visual"),
    modalTitle: document.getElementById("modal-title"),
    modalSummary: document.getElementById("modal-summary"),
    modalWhyWrap: document.getElementById("modal-why-wrap"),
    modalWhy: document.getElementById("modal-why"),
    modalNotesWrap: document.getElementById("modal-notes-wrap"),
    modalNotes: document.getElementById("modal-notes"),
    modalStack: document.getElementById("modal-stack"),
    modalActions: document.getElementById("modal-actions"),
  };

  function resolveInitialTheme() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("theme");
    if (THEMES.includes(fromUrl)) return fromUrl;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (THEMES.includes(saved)) return saved;
    } catch (_) {
      // Ignore storage errors in restricted contexts
    }
    return "gallery";
  }

  function applyTheme(theme, persist = true) {
    if (!THEMES.includes(theme)) return;
    state.theme = theme;
    els.html.setAttribute("data-theme", theme);

    els.themeBtns.forEach((btn) => {
      const active = btn.getAttribute("data-set-theme") === theme;
      btn.setAttribute("aria-pressed", String(active));
    });

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {}
      const url = new URL(window.location.href);
      url.searchParams.set("theme", theme);
      window.history.replaceState({}, "", url);
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildVisualSvg(kind, id) {
    const label = `#${escapeHtml(id)}`;
    switch (kind) {
      case "knowledge":
        return `
          <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="지식 그래프 일러스트">
            <rect width="480" height="300" fill="#eef3fb" />
            <g stroke="#9ab6ea" stroke-width="1.5">
              <line x1="120" y1="108" x2="228" y2="146" />
              <line x1="228" y1="146" x2="344" y2="96" />
              <line x1="228" y1="146" x2="318" y2="210" />
              <line x1="120" y1="108" x2="152" y2="212" />
              <line x1="152" y1="212" x2="318" y2="210" />
            </g>
            <circle cx="120" cy="108" r="14" fill="#ffffff" stroke="#2563eb" stroke-width="2.5" />
            <circle cx="228" cy="146" r="22" fill="#2563eb" />
            <circle cx="344" cy="96" r="16" fill="#ffffff" stroke="#2563eb" stroke-width="2.5" />
            <circle cx="318" cy="210" r="13" fill="#dbeafe" stroke="#2563eb" stroke-width="2" />
            <circle cx="152" cy="212" r="11" fill="#ffffff" stroke="#64748b" stroke-width="2" />
            <text x="24" y="34" font-family="IBM Plex Mono, monospace" font-size="13" fill="#475569">${label} · TIL GRAPH</text>
          </svg>`;
      case "nas":
        return `
          <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="로컬 NAS 스토리지 일러스트">
            <rect width="480" height="300" fill="#f3f1eb" />
            <rect x="130" y="64" width="220" height="172" rx="12" fill="#ffffff" stroke="#475569" stroke-width="2" />
            <rect x="150" y="88" width="180" height="34" rx="5" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
            <rect x="150" y="133" width="180" height="34" rx="5" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
            <rect x="150" y="178" width="180" height="34" rx="5" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5" />
            <circle cx="168" cy="105" r="4.5" fill="#10b981" />
            <circle cx="168" cy="150" r="4.5" fill="#10b981" />
            <circle cx="168" cy="195" r="4.5" fill="#f59e0b" />
            <line x1="186" y1="105" x2="296" y2="105" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
            <line x1="186" y1="150" x2="274" y2="150" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
            <line x1="186" y1="195" x2="250" y2="195" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />
            <text x="24" y="34" font-family="IBM Plex Mono, monospace" font-size="13" fill="#57534e">${label} · LOCAL NAS</text>
          </svg>`;
      case "helicopter":
        return `
          <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="도심 헬리콥터 게임 일러스트">
            <rect width="480" height="300" fill="#e6f2f1" />
            <!-- City Skyline -->
            <rect x="44" y="176" width="52" height="124" fill="#cbd5e1" />
            <rect x="108" y="138" width="64" height="162" fill="#94a3b8" />
            <rect x="186" y="186" width="56" height="114" fill="#cbd5e1" />
            <rect x="256" y="122" width="72" height="178" fill="#64748b" />
            <rect x="342" y="164" width="58" height="136" fill="#94a3b8" />
            <rect x="410" y="196" width="42" height="104" fill="#cbd5e1" />
            <!-- Helicopter -->
            <g transform="translate(154, 72)">
              <line x1="8" y1="4" x2="96" y2="4" stroke="#0f766e" stroke-width="3.5" stroke-linecap="round" />
              <line x1="52" y1="4" x2="52" y2="16" stroke="#0f766e" stroke-width="3" />
              <rect x="24" y="16" width="56" height="26" rx="12" fill="#0f766e" />
              <path d="M56 20 H72 A8 8 0 0 1 76 34 H56 Z" fill="#ccfbf1" />
              <line x1="24" y1="26" x2="-12" y2="22" stroke="#0f766e" stroke-width="4" stroke-linecap="round" />
              <circle cx="-14" cy="22" r="6" fill="none" stroke="#0f766e" stroke-width="2.5" />
              <line x1="28" y1="48" x2="76" y2="48" stroke="#0f766e" stroke-width="3" stroke-linecap="round" />
              <line x1="38" y1="42" x2="36" y2="48" stroke="#0f766e" stroke-width="2.5" />
              <line x1="66" y1="42" x2="68" y2="48" stroke="#0f766e" stroke-width="2.5" />
            </g>
            <text x="24" y="34" font-family="IBM Plex Mono, monospace" font-size="13" fill="#0f5f59">${label} · CITY FLIGHT</text>
          </svg>`;
      case "migration":
        return `
          <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="구글 드라이브 폴더 마이그레이션 일러스트">
            <rect width="480" height="300" fill="#edf3f8" />
            <!-- Source Folder -->
            <g transform="translate(68, 102)">
              <path d="M0 16 C0 10 5 6 11 6 H50 L62 18 H118 C124 18 128 22 128 28 V96 C128 102 124 106 118 106 H11 C5 106 0 102 0 96 Z" fill="#ffffff" stroke="#64748b" stroke-width="2" />
              <line x1="20" y1="46" x2="96" y2="46" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
              <line x1="20" y1="64" x2="78" y2="64" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
              <line x1="20" y1="82" x2="88" y2="82" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" />
            </g>
            <!-- Transfer Flow -->
            <g stroke="#0f766e" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <line x1="212" y1="158" x2="266" y2="158" stroke-dasharray="5 5" />
              <polyline points="256,149 268,158 256,167" />
            </g>
            <!-- Target Folder -->
            <g transform="translate(284, 102)">
              <path d="M0 16 C0 10 5 6 11 6 H50 L62 18 H118 C124 18 128 22 128 28 V96 C128 102 124 106 118 106 H11 C5 106 0 102 0 96 Z" fill="#e6f4f1" stroke="#0f766e" stroke-width="2.2" />
              <circle cx="96" cy="76" r="16" fill="#0f766e" />
              <polyline points="89,76 94,81 104,71" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
              <line x1="20" y1="46" x2="82" y2="46" stroke="#5ea8a1" stroke-width="3" stroke-linecap="round" />
              <line x1="20" y1="64" x2="66" y2="64" stroke="#5ea8a1" stroke-width="3" stroke-linecap="round" />
            </g>
            <text x="24" y="34" font-family="IBM Plex Mono, monospace" font-size="13" fill="#334155">${label} · DRIVE MIGRATOR</text>
          </svg>`;
      default:
        return `
          <svg viewBox="0 0 480 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="실험 기본 일러스트">
            <rect width="480" height="300" fill="#eef0f3" />
            <circle cx="240" cy="150" r="64" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6 6" />
            <rect x="212" y="122" width="56" height="56" rx="8" fill="#ffffff" stroke="#334155" stroke-width="2" />
            <text x="24" y="34" font-family="IBM Plex Mono, monospace" font-size="13" fill="#475569">${label} · EXPERIMENT</text>
          </svg>`;
    }
  }

  function renderVisual(project) {
    if (project.thumbnail) {
      return `<img src="${escapeHtml(project.thumbnail)}" alt="${escapeHtml(project.title)} 미리보기" loading="lazy" />`;
    }
    return buildVisualSvg(project.visual, project.id);
  }

  function renderStats() {
    const total = state.projects.length;
    const liveCount = state.projects.filter((p) => p.status === "live").length;
    const latest = [...state.projects].sort((a, b) => b.date.localeCompare(a.date))[0];

    els.labStats.innerHTML = `
      <span class="stat-item">총 실험 <strong class="stat-value">${total}</strong></span>
      <span class="stat-item">웹 체험 가능 <strong class="stat-value">${liveCount}</strong></span>
      ${latest ? `<span class="stat-item">최근 기록 <strong class="stat-value">${escapeHtml(latest.date)}</strong></span>` : ""}
    `;
  }

  function renderCategoryFilters() {
    const categories = ["전체", ...new Set(state.projects.map((p) => p.category).filter(Boolean))];
    els.categoryFilters.innerHTML = categories
      .map((cat) => {
        const count = cat === "전체"
          ? state.projects.length
          : state.projects.filter((p) => p.category === cat).length;
        const active = state.category === cat;
        return `
          <button
            type="button"
            role="tab"
            aria-selected="${active}"
            class="filter-btn ${active ? "is-active" : ""}"
            data-category="${escapeHtml(cat)}"
          >
            ${escapeHtml(cat)} (${count})
          </button>
        `;
      })
      .join("");
  }

  function getFilteredProjects() {
    const q = state.query.trim().toLowerCase();
    const list = state.projects.filter((p) => {
      const catOk = state.category === "전체" || p.category === state.category;
      if (!catOk) return false;
      if (!q) return true;
      const haystack = [
        p.id,
        p.title,
        p.summary,
        p.why,
        p.category,
        ...(p.stack || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return list.sort((a, b) => {
      if (state.sort === "oldest") {
        return a.id.localeCompare(b.id);
      }
      return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
    });
  }

  function renderProjects() {
    const filtered = getFilteredProjects();

    if (filtered.length === 0) {
      els.projectList.innerHTML = "";
      els.emptyState.hidden = false;
      return;
    }

    els.emptyState.hidden = true;
    els.projectList.innerHTML = filtered
      .map((p) => {
        const statusKey = p.status || "prototype";
        const statusText = STATUS_LABEL[statusKey] || statusKey;
        const liveUrl = p.links?.live;
        const repoUrl = p.links?.repo;

        return `
          <article class="project-card" data-project-id="${escapeHtml(p.id)}" tabindex="0" aria-label="${escapeHtml(p.title)} 상세 보기">
            <div class="card-visual">
              ${renderVisual(p)}
            </div>

            <div class="card-index">
              <span class="exp-id">#${escapeHtml(p.id)}</span>
              <time class="exp-date" datetime="${escapeHtml(p.date)}">${escapeHtml(p.date)}</time>
            </div>

            <div class="card-body">
              <div class="card-head-row">
                <h2 class="exp-title">${escapeHtml(p.title)}</h2>
                <span class="status-pill status-${escapeHtml(statusKey)}">
                  <span class="status-dot" aria-hidden="true"></span>${escapeHtml(statusText)}
                </span>
              </div>
              <p class="exp-summary">${escapeHtml(p.summary)}</p>
              <div class="card-meta-row">
                <span class="card-category">${escapeHtml(p.category)}</span>
                <div class="exp-tags">
                  ${(p.stack || [])
                    .map((tech) => `<span class="tag-chip">${escapeHtml(tech)}</span>`)
                    .join("")}
                </div>
              </div>
            </div>

            <div class="card-col-category">${escapeHtml(p.category)}</div>
            <div class="card-col-status">
              <span class="status-pill status-${escapeHtml(statusKey)}">
                <span class="status-dot" aria-hidden="true"></span>${escapeHtml(statusText)}
              </span>
            </div>
            <div class="card-col-date">${escapeHtml(p.date)}</div>

            <div class="exp-actions">
              ${liveUrl ? `<a class="btn-primary" href="${escapeHtml(liveUrl)}" target="_blank" rel="noopener noreferrer" data-stop-card>열기</a>` : ""}
              ${repoUrl ? `<a class="btn-secondary" href="${escapeHtml(repoUrl)}" target="_blank" rel="noopener noreferrer" data-stop-card>GitHub</a>` : ""}
            </div>
          </article>
        `;
      })
      .join("");
  }

  function openModal(projectId) {
    const project = state.projects.find((p) => p.id === projectId);
    if (!project) return;

    const statusKey = project.status || "prototype";
    const statusText = STATUS_LABEL[statusKey] || statusKey;

    els.modalMeta.innerHTML = `
      <span class="exp-id">#${escapeHtml(project.id)}</span>
      <span class="exp-date">${escapeHtml(project.date)}</span>
      <span class="status-pill status-${escapeHtml(statusKey)}">
        <span class="status-dot" aria-hidden="true"></span>${escapeHtml(statusText)}
      </span>
    `;

    els.modalVisual.innerHTML = renderVisual(project);
    els.modalTitle.textContent = project.title;
    els.modalSummary.textContent = project.summary;

    if (project.why) {
      els.modalWhyWrap.hidden = false;
      els.modalWhy.textContent = project.why;
    } else {
      els.modalWhyWrap.hidden = true;
    }

    if (project.notes) {
      els.modalNotesWrap.hidden = false;
      els.modalNotes.textContent = project.notes;
    } else {
      els.modalNotesWrap.hidden = true;
    }

    els.modalStack.innerHTML = (project.stack || [])
      .map((tech) => `<span class="tag-chip">${escapeHtml(tech)}</span>`)
      .join("");

    const actions = [];
    if (project.links?.live) {
      actions.push(`<a class="btn-primary" href="${escapeHtml(project.links.live)}" target="_blank" rel="noopener noreferrer">웹에서 바로 열기</a>`);
    }
    if (project.links?.repo) {
      actions.push(`<a class="btn-secondary" href="${escapeHtml(project.links.repo)}" target="_blank" rel="noopener noreferrer">GitHub 저장소 보기</a>`);
    }
    els.modalActions.innerHTML = actions.join("");

    els.modal.hidden = false;
    document.body.style.overflow = "hidden";
    els.modalClose.focus();
  }

  function closeModal() {
    if (els.modal.hidden) return;
    els.modal.hidden = true;
    document.body.style.overflow = "";
  }

  function bindEvents() {
    els.themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(btn.getAttribute("data-set-theme"));
      });
    });

    els.categoryFilters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-category]");
      if (!btn) return;
      state.category = btn.getAttribute("data-category");
      renderCategoryFilters();
      renderProjects();
    });

    els.searchInput.addEventListener("input", (e) => {
      state.query = e.target.value;
      renderProjects();
    });

    els.sortSelect.addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderProjects();
    });

    els.resetFilterBtn.addEventListener("click", () => {
      state.category = "전체";
      state.query = "";
      els.searchInput.value = "";
      renderCategoryFilters();
      renderProjects();
    });

    els.randomBtn.addEventListener("click", () => {
      const pool = getFilteredProjects();
      const targetList = pool.length ? pool : state.projects;
      if (!targetList.length) return;
      const pick = targetList[Math.floor(Math.random() * targetList.length)];
      openModal(pick.id);
    });

    els.projectList.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop-card]")) return;
      const card = e.target.closest("[data-project-id]");
      if (!card) return;
      openModal(card.getAttribute("data-project-id"));
    });

    els.projectList.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest("[data-stop-card]")) return;
      const card = e.target.closest("[data-project-id]");
      if (!card) return;
      e.preventDefault();
      openModal(card.getAttribute("data-project-id"));
    });

    els.modalClose.addEventListener("click", closeModal);
    els.modal.addEventListener("click", (e) => {
      if (e.target === els.modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }

      const tag = document.activeElement?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (inInput) return;

      if (e.key === "1") applyTheme("gallery");
      if (e.key === "2") applyTheme("notebook");
      if (e.key === "3") applyTheme("terminal");
      if (e.key === "/") {
        e.preventDefault();
        els.searchInput.focus();
      }
    });
  }

  async function init() {
    applyTheme(resolveInitialTheme(), false);
    bindEvents();

    try {
      const res = await fetch("./data/projects.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      state.lab = data.lab || {};
      state.projects = Array.isArray(data.projects) ? data.projects : [];

      if (state.lab.title) els.labTitle.textContent = state.lab.title;
      if (state.lab.subtitle) els.labSubtitle.textContent = state.lab.subtitle;
      if (state.lab.repo) els.footerRepo.href = state.lab.repo;
      if (state.lab.github) els.footerGithub.href = state.lab.github;

      renderStats();
      renderCategoryFilters();
      renderProjects();
    } catch (err) {
      els.projectList.innerHTML = `
        <div class="empty-state">
          <p class="empty-title">실험 목록을 불러오지 못했습니다.</p>
          <p class="empty-desc">로컬에서 파일로 직접 열었다면 <code>python3 -m http.server 8080</code> 같은 로컬 서버로 확인해 주세요.</p>
        </div>
      `;
      console.error("Failed to load projects.json:", err);
    }
  }

  init();
})();
