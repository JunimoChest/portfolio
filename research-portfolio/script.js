const PASSWORD_HASH = "c1c89f0f71b1caf9706060ea339b7ec12d618f2db4306927d8123d71a14ba2dc";
const FALLBACK_BASE64 = "cWR5";
const SESSION_KEY = "portfolio-unlocked";

const sections = [
  {
    id: "user-research",
    number: "01",
    title: "用户研究",
    accent: "#1f5b45",
    description: "围绕用户行为、使用意愿和影响因素，完成研究问题设计、问卷调研、模型建构与结论输出。",
    items: [
      {
        id: "user-research-deck",
        kind: "deck",
        typeLabel: "用户研究",
        title: "大学生移动新闻 APP 使用行为及其影响因素研究",
        summary: "在媒介融合背景下，以 UTAUT2 为理论框架，调研大学生移动新闻 APP 的使用习惯与意愿，为产品优化和运营策略提供依据。",
        cover: "assets/thumbs/user-research-cover-v3.webp",
        pages: Array.from({ length: 7 }, (_, i) => `assets/previews/user-research/slide-${i + 1}.png`),
      },
    ]
  },
  {
    id: "competitor-analysis",
    number: "02",
    title: "竞品分析",
    accent: "#2d5f8a",
    description: "从产品、市场、竞品和用户角度拆解竞争格局，形成可复用的比较框架与策略判断。",
    items: [
      {
        id: "competitor-report-ebook",
        kind: "ebook",
        typeLabel: "游戏竞品月报",
        title: "《酋长你别跑》2026 年 1 月肉鸽手游竞品分析",
        summary: "按市场态势、素材特征与短视频钩子组织，分析四款竞品的版本动作、素材方向和创意机会。",
        cover: "assets/thumbs/game-competitor-cover.webp",
        pages: Array.from({ length: 7 }, (_, i) => `assets/previews/competitor-report/page-${i + 1}.png`),
      },
      {
        id: "competitor-halfciyuan",
        kind: "article",
        typeLabel: "产品研究",
        title: "产品分析报告｜半次元：深耕二次元内容社区",
        summary: "以半次元为例，从市场、竞品和用户三个维度分析垂直内容社区的产品定位、增长空间与竞争壁垒。",
        cover: "assets/thumbs/competitor-halfciyuan.webp",
        href: "https://zhuanlan.zhihu.com/p/2083541966793528378"
      }
    ]
  },
  {
    id: "marketing-insight",
    number: "03",
    title: "营销洞察",
    accent: "#a9552d",
    description: "从内容化联名和跨界营销案例中提炼传播机制、用户动机与品牌风险。",
    items: [
      {
        id: "marketing-collab",
        kind: "article",
        typeLabel: "行业洞察",
        title: "多邻国 x 瑞幸官宣“生子”：品牌联名从“借流量”到“造内容”",
        summary: "以瑞幸与多邻国为案例，分析联名如何从流量置换走向内容共创，并提示转化、品牌稀释和叙事风险。",
        cover: "assets/thumbs/marketing-collab.webp",
        href: "https://mp.weixin.qq.com/s/_0U52Kqw5hrpWj-EJ5yXnA"
      },
      {
        id: "marketing-game-food",
        kind: "article",
        typeLabel: "行业洞察",
        title: "为什么游戏爱和麦当劳、肯德基、奶茶咖啡联动？",
        summary: "拆解游戏与连锁餐饮联动的玩法、用户重合与消费场景，并讨论内容共创和技术沉浸的升级方向。",
        cover: "assets/thumbs/marketing-game-food.webp",
        href: "https://mp.weixin.qq.com/s/ZB5uADPCuzQF_SWaYRaKQA"
      }
    ]
  },
  {
    id: "industry-analysis",
    number: "04",
    title: "行业分析",
    accent: "#9a7627",
    description: "以理财分析为落脚点，对热门行业进行商业逻辑和增长研究。",
    items: [
      {
        id: "industry-pcb",
        kind: "article",
        typeLabel: "行业研究与投资分析",
        title: "PCB 行业及相关基金分析：AI 算力、光模块与汽车电子的共同底座",
        summary: "梳理 AI 服务器、光模块与汽车电子驱动的 PCB 产业升级，以及相关基金的真实暴露和周期风险。",
        cover: "assets/thumbs/industry-pcb.webp",
        href: "https://zhuanlan.zhihu.com/p/2083201865706125252"
      },
      {
        id: "industry-game-etf",
        kind: "article",
        typeLabel: "行业研究与投资分析",
        title: "从游戏行业到游戏 ETF：行业增长如何传导到基金净值？",
        summary: "从出海、小游戏与多端发行出发，分析游戏行业增长如何经过指数持仓和估值传导到基金净值。",
        cover: "assets/thumbs/industry-game-etf.webp",
        href: "https://zhuanlan.zhihu.com/p/2082861997436188181"
      }
    ]
  }
];

const state = {
  currentDeck: 0,
  currentItem: null,
  sectionsRendered: false
};

const gate = document.getElementById("passwordGate");
const siteShell = document.getElementById("siteShell");
const form = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const gateError = document.getElementById("gateError");
const sectionNav = document.getElementById("sectionNav");
const sectionsRoot = document.getElementById("sections");
const viewer = document.getElementById("viewer");
const viewerBody = document.getElementById("viewerBody");
const viewerTitle = document.getElementById("viewerTitle");
const viewerType = document.getElementById("viewerType");
const viewerClose = document.getElementById("viewerClose");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sha256(value) {
  if (!window.crypto || !window.crypto.subtle) return null;
  const data = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function isValidPassword(value) {
  const hash = await sha256(value);
  if (hash) return hash === PASSWORD_HASH;
  try {
    return btoa(value) === FALLBACK_BASE64;
  } catch {
    return false;
  }
}

function renderNavigation() {
  sectionNav.innerHTML = sections.map((section) => `
    <a class="nav-link" href="#${section.id}" data-section-link="${section.id}">
      <span class="nav-number">${section.number}</span>
      <span>${escapeHtml(section.title)}</span>
    </a>
  `).join("");
}

function cardMarkup(item, section, index) {
  const wide = item.kind === "deck" ? " work-card--compact" : "";
  const documentClass = item.kind === "article" ? "" : " card-media--document";
  const actionIcon = item.kind === "article" ? "external-link" : item.kind === "deck" ? "presentation" : "book-open";

  const actionText = item.kind === "article" ? "点击跳转" : "点击查看";
  const content = `
    <div class="card-media${documentClass}">
      <div class="card-image-frame">
        <img src="${escapeHtml(item.cover)}" alt="" loading="${index === 0 ? "eager" : "lazy"}">
      </div>
      <span class="card-type">${escapeHtml(item.typeLabel)}</span>
    </div>
    <div class="card-body">
      <h3 class="card-title">${escapeHtml(item.title)}</h3>
      <p class="card-summary${item.nowrap ? " card-summary--nowrap" : ""}">${escapeHtml(item.summary)}</p>
      <div class="card-footer">
        <span class="card-open">
          <i data-lucide="${actionIcon}" aria-hidden="true"></i>
          ${actionText ? `<span>${actionText}</span>` : ""}
        </span>
      </div>
    </div>`;

  if (item.kind === "article") {
    return `<a class="work-card${wide}" href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer" style="--section-color:${section.accent}">${content}</a>`;
  }

  return `<article class="work-card${wide}" style="--section-color:${section.accent}">
    <button class="work-card__action" type="button" data-local-id="${escapeHtml(item.id)}" aria-label="打开 ${escapeHtml(item.title)}">${content}</button>
  </article>`;
}

function renderSections() {
  if (state.sectionsRendered) return;
  sectionsRoot.innerHTML = sections.map((section) => `
    <section class="section" id="${section.id}" style="--section-color:${section.accent}">
      <div class="section-head">
        <span class="section-index">${section.number}</span>
        <div>
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <p class="section-description">${escapeHtml(section.description)}</p>
        </div>
      </div>
      <div class="card-grid${section.items.length === 1 ? " card-grid--single" : ""}">
        ${section.items.map((item, index) => cardMarkup(item, section, index)).join("")}
      </div>
    </section>
  `).join("");
  state.sectionsRendered = true;
  if (window.lucide) window.lucide.createIcons();
}

function unlock({ persist = true } = {}) {
  gate.classList.add("is-hidden");
  document.body.classList.remove("is-locked");
  siteShell.setAttribute("aria-hidden", "false");
  siteShell.inert = false;
  siteShell.classList.add("is-visible");
  renderNavigation();
  renderSections();
  if (persist) {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch {}
  }
  setTimeout(() => passwordInput.blur(), 0);
}

function lock() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
  closeViewer();
  gate.classList.remove("is-hidden");
  document.body.classList.add("is-locked");
  siteShell.setAttribute("aria-hidden", "true");
  siteShell.inert = true;
  siteShell.classList.remove("is-visible");
  passwordInput.value = "";
  gateError.textContent = "";
  setTimeout(() => passwordInput.focus(), 0);
}

function findItem(id) {
  for (const section of sections) {
    const item = section.items.find((entry) => entry.id === id);
    if (item) return item;
  }
  return null;
}

function openLocalItem(id) {
  const item = findItem(id);
  if (!item) return;
  state.currentItem = item;
  state.currentDeck = 0;
  viewerTitle.textContent = item.title;
  viewerType.textContent = item.typeLabel;
  viewerBody.className = `viewer-body ${item.kind === "deck" ? "is-deck" : ""}`;

  if (item.kind === "deck") {
    viewerBody.innerHTML = `
      <div class="deck-view">
        <button class="icon-button deck-nav" type="button" id="deckPrev" aria-label="上一页"><i data-lucide="chevron-left"></i></button>
        <figure class="deck-image-wrap">
          <img class="deck-image" id="deckImage" src="${escapeHtml(item.pages[0])}" alt="">
        </figure>
        <button class="icon-button deck-nav" type="button" id="deckNext" aria-label="下一页"><i data-lucide="chevron-right"></i></button>
      </div>
      <span class="viewer-count" id="deckCount">1 / ${item.pages.length}</span>`;
    document.getElementById("deckPrev").addEventListener("click", () => changeDeck(-1));
    document.getElementById("deckNext").addEventListener("click", () => changeDeck(1));
  } else {
    viewerBody.innerHTML = `<div class="ebook-view">${item.pages.map((page, index) => `
      <figure class="ebook-page">
        <img src="${escapeHtml(page)}" alt="第 ${index + 1} 页" loading="${index < 2 ? "eager" : "lazy"}">
      </figure>`).join("")}</div>`;
  }

  viewer.classList.add("is-open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  if (window.lucide) window.lucide.createIcons();
  viewerClose.focus();
}

function changeDeck(direction) {
  const item = state.currentItem;
  if (!item || item.kind !== "deck") return;
  state.currentDeck = (state.currentDeck + direction + item.pages.length) % item.pages.length;
  document.getElementById("deckImage").src = item.pages[state.currentDeck];
  document.getElementById("deckCount").textContent = `${state.currentDeck + 1} / ${item.pages.length}`;
}

function closeViewer() {
  viewer.classList.remove("is-open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  viewerBody.innerHTML = "";
  state.currentItem = null;
}

function setupActiveNavigation() {
  const links = Array.from(document.querySelectorAll("[data-section-link]"));
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("is-active", link.dataset.sectionLink === visible.target.id));
  }, { rootMargin: "-15% 0px -70% 0px", threshold: [0.1, 0.4, 0.7] });
  document.querySelectorAll(".section").forEach((section) => observer.observe(section));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  gateError.textContent = "";
  const allowed = await isValidPassword(passwordInput.value);
  if (!allowed) {
    gateError.textContent = "密码错误，请重新输入。";
    passwordInput.select();
    return;
  }
  unlock();
});

document.addEventListener("click", (event) => {
  const localButton = event.target.closest("[data-local-id]");
  if (localButton) openLocalItem(localButton.dataset.localId);
  if (event.target.closest("[data-close-viewer]") || event.target.closest("#viewerClose")) closeViewer();
});

document.getElementById("lockButton").addEventListener("click", lock);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && viewer.classList.contains("is-open")) closeViewer();
  if (!viewer.classList.contains("is-open")) return;
  if (event.key === "ArrowLeft") changeDeck(-1);
  if (event.key === "ArrowRight") changeDeck(1);
});

async function boot() {
  let unlocked = false;
  try { unlocked = sessionStorage.getItem(SESSION_KEY) === "1"; } catch {}
  if (unlocked) {
    unlock({ persist: false });
    setupActiveNavigation();
  } else {
    siteShell.inert = true;
    passwordInput.focus();
  }
  if (window.lucide) window.lucide.createIcons();
}

boot();