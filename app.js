const COLOR_INFO = {
  R: { name: "Rot", glyph: "🔥" },
  U: { name: "Blau", glyph: "💧" },
  W: { name: "Weiß", glyph: "☀" },
  B: { name: "Schwarz", glyph: "☠" },
  G: { name: "Grün", glyph: "🌿" },
  M: { name: "Mehrfarbig", glyph: "✦" }
};

const app = document.querySelector("#app");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function manaBadge(color) {
  const info = COLOR_INFO[color] || { name: color, glyph: color };
  const badge = el("span", `mana mana-${color}`, info.glyph);
  badge.title = info.name;
  badge.setAttribute("aria-label", info.name);
  return badge;
}

function manaRow(colors) {
  const row = el("span", "mana-row");
  colors.forEach(color => row.append(manaBadge(color)));
  return row;
}

function cardTotal(deck) {
  return [...(deck.cards || []), ...(deck.lands || [])]
    .reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

async function loadLibrary() {
  const configResponse = await fetch("data/library.json", { cache: "no-cache" });
  if (!configResponse.ok) throw new Error("library.json konnte nicht geladen werden.");
  const config = await configResponse.json();

  const sourceFiles = await Promise.all(
    config.sources.map(async source => {
      const response = await fetch(source, { cache: "no-cache" });
      if (!response.ok) throw new Error(`${source} konnte nicht geladen werden.`);
      const data = await response.json();
      return { source, ...data };
    })
  );

  const decks = sourceFiles.flatMap(file =>
    (file.decks || []).map(deck => ({
      ...deck,
      collection: file.collection || "",
      sourceFile: file.source
    }))
  );

  return { config, decks };
}

function createDeckCard(deck) {
  const link = el("a", `deck-card group-${deck.group}`);
  link.href = `?deck=${encodeURIComponent(deck.id)}`;

  link.append(el("h3", "deck-name", deck.name));
  link.append(manaRow(deck.colors || [deck.group]));
  link.append(el("p", "deck-desc", deck.description || "Keine Beschreibung hinterlegt."));
  return link;
}

function renderOverview(config, decks) {
  document.title = config.title || "MTG Jumpstart Cube";
  app.replaceChildren();

  const hero = el("section", "hero");
  const intro = el("div");
  intro.append(el("p", "eyebrow", "Jumpstart-Bibliothek"));
  intro.append(el("h1", "", config.title || "MTG Jumpstart Cube"));
  intro.append(el("p", "hero-copy", config.subtitle || "Deck auswählen und Karten zurücksortieren."));
  hero.append(intro);

  const toolbar = el("div", "toolbar");
  const search = el("input", "search");
  search.type = "search";
  search.placeholder = "Deck suchen…";
  search.autocomplete = "off";
  search.setAttribute("aria-label", "Deck suchen");
  const count = el("div", "library-count", `${decks.length} Halfdecks`);
  toolbar.append(search, count);
  hero.append(toolbar);
  app.append(hero);

  const sections = [];
  const colorOrder = config.colorOrder || ["R", "U", "W", "B", "G", "M"];

  colorOrder.forEach(group => {
    const groupDecks = decks
      .filter(deck => deck.group === group)
      .sort((a, b) => a.name.localeCompare(b.name, "de"));

    if (!groupDecks.length) return;

    const section = el("section", `color-section group-${group}`);
    section.dataset.group = group;

    const title = el("h2", "section-title");
    title.append(manaBadge(group));
    title.append(document.createTextNode(COLOR_INFO[group]?.name || group));
    title.append(el("span", "count", `${groupDecks.length} Decks`));
    section.append(title);

    const grid = el("div", "deck-grid");
    groupDecks.forEach(deck => {
      const card = createDeckCard(deck);
      card.dataset.search = `${deck.name} ${deck.description || ""}`.toLocaleLowerCase("de");
      grid.append(card);
    });
    section.append(grid);
    app.append(section);
    sections.push(section);
  });

  const noResults = el("div", "empty-state hidden", "Kein passendes Deck gefunden.");
  app.append(noResults);

  search.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase("de");
    let visible = 0;

    sections.forEach(section => {
      let sectionVisible = 0;
      section.querySelectorAll(".deck-card").forEach(card => {
        const match = !query || card.dataset.search.includes(query);
        card.classList.toggle("hidden", !match);
        if (match) {
          visible += 1;
          sectionVisible += 1;
        }
      });
      section.classList.toggle("hidden", sectionVisible === 0);
    });

    count.textContent = query ? `${visible} Treffer` : `${decks.length} Halfdecks`;
    noResults.classList.toggle("hidden", visible !== 0);
  });
}

function renderList(title, entries) {
  const panel = el("section", "list-panel");
  panel.append(el("h2", "", title));
  const list = el("ul", "card-list");

  entries.forEach(item => {
    const row = el("li");
    row.append(el("span", "qty", `${item.qty}×`));
    row.append(el("span", "", item.name));
    list.append(row);
  });

  panel.append(list);
  return panel;
}

function renderDetail(config, decks, deckId) {
  const deck = decks.find(item => item.id === deckId);
  app.replaceChildren();

  const detail = el("article", `detail group-${deck?.group || "M"}`);

  const back = el("a", "back-link", "← Zur Übersicht");
  back.href = "./";
  detail.append(back);

  if (!deck) {
    detail.append(el("div", "error", "Dieses Deck wurde nicht gefunden."));
    app.append(detail);
    return;
  }

  document.title = `${deck.name} · ${config.title || "MTG Jumpstart Cube"}`;

  const head = el("header", "detail-head");
  head.append(el("p", "eyebrow", deck.collection || "Jumpstart"));
  head.append(el("h1", "", deck.name));
  head.append(el("p", "detail-description", deck.description || "Keine Beschreibung hinterlegt."));

  const meta = el("div", "detail-meta");
  meta.append(manaRow(deck.colors || [deck.group]));
  meta.append(el("span", "", `${cardTotal(deck)} Karten gesamt`));
  head.append(meta);
  detail.append(head);

  const lists = el("div", "card-lists");
  lists.append(renderList("Karten", deck.cards || []));
  lists.append(renderList("Länder", deck.lands || []));
  detail.append(lists);

  app.append(detail);
}

async function init() {
  try {
    const { config, decks } = await loadLibrary();
    const deckId = new URLSearchParams(location.search).get("deck");
    if (deckId) renderDetail(config, decks, deckId);
    else renderOverview(config, decks);
  } catch (error) {
    console.error(error);
    app.replaceChildren(el("div", "error", "Die Bibliothek konnte nicht geladen werden. Bitte prüfe die JSON-Dateien."));
  }
}

init();
