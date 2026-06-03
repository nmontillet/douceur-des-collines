/* =====================================================================
   Douceur des Collines — main.js
   Header scroll, burger menu, Leaflet maps, filtres POS, formulaires
   ===================================================================== */

/* ----- Données partagées (points de vente) ----- */
const FARM_LATLNG = [44.64656, 2.22974]; // La Berbezie, Saint-Santin (12300) — géocodé OSM

const POS_DATA = [
  // Supermarchés
  { id: "im-maurs",    kind: "super",    dept: "15", name: "Intermarché SUPER Saint-Étienne-de-Maurs", shortName: "Maurs",     town: "Saint-Étienne-de-Maurs", addr: "8 Av. d'Aurillac, 15600 Saint-Étienne-de-Maurs",        phone: "04 71 49 02 11", hours: "Lun–Sam 8h30–19h30", prods: "Yaourts nature & vanille", lat: 44.71417, lng: 2.20157 },
  { id: "im-flagnac",  kind: "super",    dept: "12", name: "Intermarché SUPER Flagnac",                shortName: "Flagnac",   town: "Flagnac",                addr: "RD 963 Lieu-dit La Planque, 12300 Flagnac",              phone: "05 65 64 88 04", hours: "Lun–Sam 8h30–19h30", prods: "Gamme complète",            lat: 44.60394, lng: 2.24306 },
  { id: "im-bagnac",   kind: "super",    dept: "46", name: "Intermarché CONTACT Bagnac-sur-Célé",      shortName: "Bagnac",    town: "Bagnac-sur-Célé",        addr: "Près de Blazy, Route d'Aurillac, 46270 Bagnac-sur-Célé", phone: "05 65 14 01 21", hours: "Lun–Sam 8h30–19h30", prods: "Yaourts nature & vanille", lat: 44.67010, lng: 2.16574 },
  { id: "im-figeac",   kind: "super",    dept: "46", name: "Intermarché SUPER Figeac",                 shortName: "Figeac",    town: "Figeac",                 addr: "15 Saint-Georges, Route de Cahors, 46100 Figeac",        phone: "05 65 50 02 14", hours: "Lun–Sam 8h30–20h",   prods: "Gamme complète",            lat: 44.60653, lng: 2.01368 },
  // Épiceries / fromagers
  { id: "entre-deux",  kind: "epicerie", dept: "15", name: "L'Entre Deux",                              shortName: "L'Entre Deux", town: "Saint-Santin-de-Maurs", addr: "Le Bourg, 15600 Saint-Santin-de-Maurs",                   phone: "04 71 49 30 02", hours: "Tlj sauf lun. 8h–12h30", prods: "Gamme complète",        lat: 44.65076, lng: 2.21652 },
  { id: "ginisty",     kind: "epicerie", dept: "12", name: "Boucherie Maison Ginisty",                  shortName: "Ginisty",    town: "Rodez",                   addr: "Place du Bourg, 12000 Rodez",                              phone: "05 65 68 16 64", hours: "Mar–Sam 8h–19h",    prods: "Yaourts & crème crue",      lat: 44.34876, lng: 2.57576 },
  { id: "morin",       kind: "epicerie", dept: "12", name: "Morin Fromager",                            shortName: "Morin",      town: "Rodez",                   addr: "R. Béteille, 12000 Rodez",                                 phone: "05 65 67 28 11", hours: "Mar–Sam 8h30–19h",  prods: "Crème crue",                lat: 44.35262, lng: 2.57289 },
  // Halles de l'Aveyron
  { id: "halles-rodez",   kind: "halles", dept: "12", name: "Les Halles de l'Aveyron — Rodez",                 shortName: "Rodez",   town: "Rodez",               addr: "Rte d'Espalion, 12850 Onet-le-Château",                  phone: "05 65 73 75 30", hours: "Tlj 9h–19h",      prods: "Gamme complète", lat: 44.37137, lng: 2.58916 },
  { id: "halles-issy",    kind: "halles", dept: "92", name: "Les Halles de l'Aveyron — Issy-les-Moulineaux",   shortName: "Issy",    town: "Issy-les-Moulineaux", addr: "Quai du Pdt Roosevelt, 92130 Issy-les-Moulineaux",       phone: "01 47 65 02 18", hours: "Mar–Dim 9h–19h",  prods: "Gamme complète", lat: 48.82563, lng: 2.27586 },
  { id: "halles-herblay", kind: "halles", dept: "95", name: "Les Halles de l'Aveyron — Herblay",               shortName: "Herblay", town: "Herblay-sur-Seine",  addr: "Rte de Conflans, 95220 Herblay-sur-Seine",               phone: "01 30 40 27 13", hours: "Mar–Dim 9h–19h",  prods: "Gamme complète", lat: 49.00488, lng: 2.19293 },
  // Marchés
  { id: "marche-figeac",       kind: "marche", dept: "46", name: "Marché de Figeac",       shortName: "Marché",      town: "Figeac",       addr: "Place Carnot, 46100 Figeac",  phone: "—", hours: "Sam. matin", prods: "Yaourts & crème crue", lat: 44.60946, lng: 2.03351 },
  { id: "marche-decazeville",  kind: "marche", dept: "12", name: "Marché de Decazeville",  shortName: "Decazeville", town: "Decazeville",  addr: "Place Wilson, 12300 Decazeville", phone: "—", hours: "Mar. matin", prods: "Gamme complète",     lat: 44.55999, lng: 2.25128 },
];

/* ----- Noms de villes francais poses sur la carte (le fond est sans etiquettes) ----- */
const PLACE_LABELS = [
  { name: "Aurillac", lat: 44.9261, lng: 2.4444 },
  { name: "Figeac", lat: 44.6089, lng: 2.0319 },
  { name: "Rodez", lat: 44.3506, lng: 2.5731 },
  { name: "Decazeville", lat: 44.5636, lng: 2.2497 },
  { name: "Villefranche-de-Rouergue", lat: 44.3520, lng: 2.0344 },
  { name: "Maurs", lat: 44.7089, lng: 2.1986 },
  { name: "Capdenac-Gare", lat: 44.5752, lng: 2.0780 },
  { name: "Conques", lat: 44.5980, lng: 2.3995 },
  { name: "Entraygues-sur-Truyère", lat: 44.6452, lng: 2.5663 },
  { name: "Marcillac-Vallon", lat: 44.4752, lng: 2.4664 },
  { name: "Aubin", lat: 44.5288, lng: 2.2436 },
  { name: "Montbazens", lat: 44.4744, lng: 2.2386 },
];

const CAT_META = {
  super:    { label: "Hypermarché / Supermarché", dotColor: "var(--sage)",   chipDot: "var(--sage)" },
  epicerie: { label: "Épicerie / Fromager",       dotColor: "var(--nature)", chipDot: "var(--nature)" },
  halles:   { label: "Halles de l'Aveyron",       dotColor: "var(--vanille)", chipDot: "var(--vanille)" },
  marche:   { label: "Marché / Ambulant",         dotColor: "var(--brown)",  chipDot: "var(--brown)" }
};

/* ----- Distance haversine (km) entre deux paires [lat, lng] ----- */
function haversineKm(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;
  const la1 = a[0] * Math.PI / 180, la2 = b[0] * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* ----- Header scroll ----- */
function initHeaderScroll() {
  const hdr = document.querySelector(".hdr");
  if (!hdr) return;
  const onScroll = () => hdr.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ----- Burger mobile menu ----- */
function initBurger() {
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".m-menu");
  const close = document.querySelector(".m-menu-close");
  if (!burger || !menu) return;
  burger.addEventListener("click", () => menu.classList.add("open"));
  if (close) close.addEventListener("click", () => menu.classList.remove("open"));
}

/* ----- Année dynamique footer ----- */
function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

/* ----- Carte Leaflet : helper de création ----- */
function createLeafletMap(container, options) {
  if (typeof L === "undefined" || !container) return null;
  const {
    scope = "regional",
    interactive = false,
    onSelect = null,
    center = null,
    zoom = 9,
  } = options || {};

  // Filtre les POS selon le scope
  const visible = scope === "all"
    ? POS_DATA
    : scope === "paris"
      ? POS_DATA.filter(p => p.dept === "92" || p.dept === "95")
      : POS_DATA.filter(p => ["12","15","46"].includes(p.dept));

  const initialCenter = center || (scope === "paris" ? [48.88, 2.22] : FARM_LATLNG);

  const map = L.map(container, {
    zoomControl: interactive,
    fadeAnimation: false,
    attributionControl: false,
    scrollWheelZoom: interactive,
    dragging: interactive,
    doubleClickZoom: interactive,
    touchZoom: interactive,
    boxZoom: false,
    keyboard: false,
  }).setView(initialCenter, zoom);

  // Fond de carte épuré CartoDB Positron : pas de relief, pas de noms/numéros
  // de routes, juste de fines lignes et l'eau. Les noms de villes français sont
  // posés manuellement (PLACE_LABELS) pour un rendu propre, constant et on-brand.
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 20,
  }).addTo(map);

  // Marqueur ferme
  const farmIcon = L.divIcon({
    className: "osm-farm",
    html: '<span class="halo"></span><span class="dot"></span><span class="lbl">Notre ferme</span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
  L.marker(FARM_LATLNG, { icon: farmIcon, zIndexOffset: 1000 }).addTo(map);

  // Marqueurs POS
  const markers = {};
  visible.forEach((p) => {
    if (!p.lat || !p.lng) return;
    const cls = "osm-pos osm-" + p.kind;
    const icon = L.divIcon({
      className: cls,
      html: '<span class="dot"></span><span class="lbl">' + p.name + '</span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
    if (onSelect) marker.on("click", () => onSelect(p.id));
    markers[p.id] = { marker, kind: p.kind };
  });

  // Noms de villes français posés manuellement (fond de carte sans étiquettes)
  PLACE_LABELS.forEach((pl) => {
    const icon = L.divIcon({
      className: "osm-place",
      html: '<span class="pl">' + pl.name + '</span>',
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
    L.marker([pl.lat, pl.lng], { icon, interactive: false, keyboard: false, zIndexOffset: -1000 }).addTo(map);
  });

  // Auto-fit bounds : on cadre le cluster régional (sud-ouest) pour éviter que
  // les points parisiens dézooment la carte sur une vue France entière.
  const nearby = visible.filter(p => p.lat && p.lng && ["12", "15", "46"].includes(p.dept));
  const boundsPts = nearby.length ? nearby : visible.filter(p => p.lat && p.lng);
  const latlngs = [FARM_LATLNG, ...boundsPts.map(p => [p.lat, p.lng])];
  const fit = () => {
    if (latlngs.length > 1) {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [40, 40], maxZoom: 10 });
    } else {
      map.setView(initialCenter, zoom);
    }
  };
  fit();

  // Leaflet mesure son conteneur à l'init ; si la hauteur n'est pas encore
  // stabilisée, les tuiles ne remplissent qu'un sous-rectangle (carte grise).
  // On recalcule la taille (et on re-cadre) une fois posé, puis à chaque resize.
  const ensureSize = () => { map.invalidateSize({ animate: false }); fit(); };
  setTimeout(ensureSize, 60);
  setTimeout(ensureSize, 300);
  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    ro.observe(container);
  }

  return { map, markers };
}

/* ----- Carte d'accueil (Où nous trouver) ----- */
function initHomeMap() {
  const container = document.getElementById("home-map");
  if (!container) return;
  createLeafletMap(container, { scope: "regional", interactive: false });
}

/* ----- Carte de la page Contact (région simple, non interactive) ----- */
function initContactMap() {
  const container = document.getElementById("contact-map");
  if (!container) return;
  createLeafletMap(container, { scope: "regional", interactive: false });
}

/* ----- Page Points de vente : carte interactive + filtres + table ----- */
function initPointsDeVente() {
  const mapContainer = document.getElementById("pos-map");
  if (!mapContainer) return;

  const state = {
    activeCat: "all",
    selectedId: null,
    search: "",
    dept: "all",
  };

  // Création de la carte
  const onSelectFromMap = (id) => {
    state.selectedId = id;
    renderDetail();
    refreshMarkerClasses();
    panTo(id);
  };
  const { map, markers } = createLeafletMap(mapContainer, { scope: "all", interactive: true, onSelect: onSelectFromMap });

  function panTo(id) {
    const entry = markers[id];
    if (!entry) return;
    map.panTo(entry.marker.getLatLng(), { animate: true });
  }

  function refreshMarkerClasses() {
    Object.entries(markers).forEach(([id, { marker, kind }]) => {
      const el = marker.getElement();
      if (!el) return;
      const dimmed = state.activeCat !== "all" && kind !== state.activeCat;
      el.classList.toggle("is-dimmed", dimmed);
      el.classList.toggle("is-active", id === state.selectedId);
    });
  }

  // Filtres (chips)
  const chips = document.querySelectorAll(".filter-chip");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state.activeCat = chip.dataset.cat;
      chips.forEach(c => c.classList.toggle("is-active", c === chip));
      renderTable();
      refreshMarkerClasses();
    });
  });

  // Search
  const searchInput = document.getElementById("pos-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.search = e.target.value;
      renderTable();
    });
  }

  // Dept select
  const deptSelect = document.getElementById("pos-dept");
  if (deptSelect) {
    deptSelect.addEventListener("change", (e) => {
      state.dept = e.target.value;
      renderTable();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById("pos-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCat = "all";
      state.search = "";
      state.dept = "all";
      if (searchInput) searchInput.value = "";
      if (deptSelect) deptSelect.value = "all";
      chips.forEach(c => c.classList.toggle("is-active", c.dataset.cat === "all"));
      renderTable();
      refreshMarkerClasses();
    });
  }

  // Detail panel
  const detailPanel = document.getElementById("pos-detail");
  function renderDetail() {
    if (!detailPanel) return;
    const sel = POS_DATA.find(p => p.id === state.selectedId);
    if (!sel) {
      detailPanel.innerHTML = `
        <div class="detail-empty">
          <div class="eyebrow">Sélection</div>
          <h3>Cliquez une pastille</h3>
          <p>Sélectionnez un point sur la carte pour voir l'adresse, les horaires et le téléphone. Ou parcourez la liste complète en dessous.</p>
          <div class="legend">
            <div><span class="lg" style="background: var(--vanille); border: 1.5px solid var(--brown);"></span> Notre ferme</div>
            <div><span class="lg" style="background: var(--sage);"></span> Hypermarchés / supermarchés</div>
            <div><span class="lg" style="background: var(--nature);"></span> Épiceries &amp; fromagers</div>
            <div><span class="lg" style="background: var(--vanille); border: 1.5px solid var(--brown);"></span> Halles de l'Aveyron</div>
            <div><span class="lg" style="background: var(--brown);"></span> Marchés &amp; ambulants</div>
          </div>
        </div>`;
      return;
    }
    const meta = CAT_META[sel.kind];
    const gmapsQ = encodeURIComponent(sel.name + " " + (sel.town || ""));
    detailPanel.innerHTML = `
      <div class="detail-content">
        <button class="detail-close" aria-label="Fermer">×</button>
        <span class="detail-cat detail-cat-${sel.kind}">${meta.label}</span>
        <h3 class="detail-name">${sel.name}</h3>
        <p class="detail-addr">${sel.addr}</p>
        <ul class="detail-meta">
          <li><span>Téléphone</span><strong>${sel.phone}</strong></li>
          <li><span>Horaires</span><strong>${sel.hours}</strong></li>
          <li><span>Produits</span><strong>${sel.prods}</strong></li>
        </ul>
        <a class="btn-link" href="https://www.google.com/maps/search/?api=1&query=${gmapsQ}" target="_blank" rel="noopener">Ouvrir dans Google Maps <span aria-hidden="true">↗</span></a>
      </div>`;
    detailPanel.querySelector(".detail-close").addEventListener("click", () => {
      state.selectedId = null;
      renderDetail();
      refreshMarkerClasses();
    });
  }

  // Table
  const tbody = document.getElementById("pos-tbody");
  const emptyEl = document.getElementById("pos-empty");
  function renderTable() {
    if (!tbody) return;
    const q = state.search.trim().toLowerCase();
    const list = POS_DATA
      .filter(p => state.activeCat === "all" || p.kind === state.activeCat)
      .filter(p => {
        if (state.dept === "all") return true;
        if (state.dept === "idf") return p.dept === "92" || p.dept === "95";
        return p.dept === state.dept;
      })
      .filter(p => !q || p.name.toLowerCase().includes(q) || (p.town || "").toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));

    tbody.innerHTML = list.map(p => {
      const meta = CAT_META[p.kind];
      const deptLbl = (p.dept === "92" || p.dept === "95") ? "IDF" : p.dept;
      const borderStyle = p.kind === "halles" ? "border: 1.5px solid var(--brown);" : "";
      return `<tr data-id="${p.id}">
        <td><span class="cat-dot" style="background: ${meta.dotColor}; ${borderStyle}"></span></td>
        <td class="ent-name">${p.name}<small>${p.addr}</small></td>
        <td>${p.town || "—"}</td>
        <td>${deptLbl}</td>
        <td>${meta.label}</td>
        <td class="row-arrow">→</td>
      </tr>`;
    }).join("");

    tbody.querySelectorAll("tr").forEach(tr => {
      tr.addEventListener("click", () => {
        state.selectedId = tr.dataset.id;
        renderDetail();
        refreshMarkerClasses();
        panTo(state.selectedId);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    if (emptyEl) emptyEl.style.display = list.length === 0 ? "" : "none";
  }

  // ----- Finder "le plus proche de chez vous" -----
  (function initNearFinder() {
    const finder = document.querySelector(".near-finder");
    if (!finder) return;
    const input = document.getElementById("near-input");
    const sugBox = document.getElementById("near-suggest");
    const form = document.getElementById("near-form");
    const gpsBtn = document.getElementById("near-gps");
    const statusEl = document.getElementById("near-status");
    const resultsEl = document.getElementById("near-results");
    if (!input || !form) return;

    let suggestions = [];
    let sugActive = -1;
    let userLoc = null;
    let debounce = null;
    let skipFetch = false;

    function setStatus(msg, isErr) {
      if (!statusEl) return;
      statusEl.textContent = msg || "";
      statusEl.style.display = msg ? "" : "none";
      statusEl.classList.toggle("near-status-err", !!isErr);
    }

    function renderSuggestions() {
      if (!sugBox) return;
      if (!suggestions.length) { sugBox.style.display = "none"; sugBox.innerHTML = ""; return; }
      sugBox.style.display = "";
      sugBox.innerHTML = suggestions.map((s, i) =>
        '<li role="option" class="near-sug' + (i === sugActive ? " is-active" : "") + '" data-i="' + i + '">' +
        '<svg viewBox="0 0 18 18" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" class="near-sug-pin"><path d="M9 16s6-5.2 6-9.5A6 6 0 0 0 3 6.5C3 10.8 9 16 9 16Z"/><circle cx="9" cy="6.5" r="2"/></svg>' +
        '<span class="near-sug-city">' + s.label + '</span>' +
        '<span class="near-sug-cp">' + (s.postcode || "") + '</span></li>').join("");
      sugBox.querySelectorAll(".near-sug").forEach(li => {
        li.addEventListener("mousedown", (e) => { e.preventDefault(); pickSuggestion(suggestions[+li.dataset.i]); });
        li.addEventListener("mouseenter", () => { sugActive = +li.dataset.i; });
      });
    }

    async function fetchSuggestions(q) {
      try {
        const url = "https://api-adresse.data.gouv.fr/search/?limit=6&type=municipality&q=" + encodeURIComponent(q);
        const r = await fetch(url);
        const j = await r.json();
        suggestions = (j.features || []).map(f => ({
          label: f.properties.city || f.properties.name,
          postcode: f.properties.postcode,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
        }));
        sugActive = -1;
        renderSuggestions();
      } catch (e) { suggestions = []; renderSuggestions(); }
    }

    function pickSuggestion(s) {
      if (!s) return;
      skipFetch = true;
      input.value = s.postcode ? (s.label + " (" + s.postcode + ")") : s.label;
      userLoc = { lat: s.lat, lng: s.lng, label: s.label };
      suggestions = []; renderSuggestions();
      setStatus("");
      renderNearest();
    }

    input.addEventListener("input", () => {
      if (skipFetch) { skipFetch = false; return; }
      const q = input.value.trim();
      clearTimeout(debounce);
      if (q.length < 2) { suggestions = []; renderSuggestions(); return; }
      debounce = setTimeout(() => fetchSuggestions(q), 220);
    });

    input.addEventListener("keydown", (e) => {
      if (!suggestions.length) return;
      if (e.key === "ArrowDown") { e.preventDefault(); sugActive = Math.min(sugActive + 1, suggestions.length - 1); renderSuggestions(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sugActive = Math.max(sugActive - 1, 0); renderSuggestions(); }
      else if (e.key === "Enter" && sugActive >= 0) { e.preventDefault(); pickSuggestion(suggestions[sugActive]); }
      else if (e.key === "Escape") { suggestions = []; renderSuggestions(); }
    });

    document.addEventListener("mousedown", (e) => {
      if (!finder.contains(e.target)) { suggestions = []; renderSuggestions(); }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (sugActive >= 0 && suggestions[sugActive]) { pickSuggestion(suggestions[sugActive]); return; }
      if (suggestions.length) { pickSuggestion(suggestions[0]); return; }
      const q = input.value.trim();
      if (!q) return;
      setStatus("Recherche en cours…");
      try {
        const url = "https://api-adresse.data.gouv.fr/search/?limit=1&q=" + encodeURIComponent(q);
        const r = await fetch(url);
        const j = await r.json();
        const f = (j.features || [])[0];
        if (!f) { setStatus("Localisation impossible. Vérifiez l'orthographe.", true); return; }
        userLoc = { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0], label: f.properties.city || f.properties.label };
        setStatus("");
        renderNearest();
      } catch (err) { setStatus("Localisation impossible. Réessayez.", true); }
    });

    if (gpsBtn) {
      gpsBtn.addEventListener("click", () => {
        if (!navigator.geolocation) { setStatus("Géolocalisation non disponible.", true); return; }
        setStatus("Recherche en cours…");
        suggestions = []; renderSuggestions();
        navigator.geolocation.getCurrentPosition(
          (pos) => { skipFetch = true; input.value = ""; userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude, label: "Ma position" }; setStatus(""); renderNearest(); },
          () => setStatus("Localisation impossible. Autorisez la géolocalisation.", true),
          { enableHighAccuracy: true, timeout: 8000 }
        );
      });
    }

    function renderNearest() {
      if (!resultsEl || !userLoc) return;
      const nearest = POS_DATA
        .filter(p => p.lat && p.lng)
        .map(p => Object.assign({}, p, { dist: haversineKm([userLoc.lat, userLoc.lng], [p.lat, p.lng]) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      resultsEl.style.display = "";
      resultsEl.innerHTML =
        '<div class="near-results-head"><span>Depuis <strong>' + userLoc.label + '</strong></span>' +
        '<button type="button" class="near-clear">Effacer ×</button></div>' +
        '<div class="near-cards">' +
        nearest.map((p, i) => {
          const meta = CAT_META[p.kind];
          const border = p.kind === "halles" ? "border: 1.5px solid var(--brown);" : "";
          const dist = p.dist < 1 ? Math.round(p.dist * 1000) + " m" : p.dist.toFixed(1).replace(".", ",") + " km";
          return '<button type="button" class="near-card' + (state.selectedId === p.id ? " is-active" : "") + '" data-id="' + p.id + '">' +
            (i === 0 ? '<span class="near-badge">Le plus proche</span>' : "") +
            '<span class="near-dist">' + dist + '</span>' +
            '<span class="near-card-name"><span class="cat-dot" style="background:' + meta.dotColor + ';' + border + '"></span>' + p.name + '</span>' +
            '<span class="near-card-town">' + p.addr + '</span></button>';
        }).join("") + '</div>';
      resultsEl.querySelector(".near-clear").addEventListener("click", () => {
        skipFetch = true; userLoc = null; input.value = ""; setStatus(""); resultsEl.style.display = "none"; resultsEl.innerHTML = "";
      });
      resultsEl.querySelectorAll(".near-card").forEach(card => {
        card.addEventListener("click", () => {
          const id = card.dataset.id;
          state.selectedId = id;
          renderDetail();
          refreshMarkerClasses();
          panTo(id);
          resultsEl.querySelectorAll(".near-card").forEach(c => c.classList.toggle("is-active", c.dataset.id === id));
          const stage = document.querySelector(".map-stage");
          if (stage) stage.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });
    }
  })();

  // Init
  renderDetail();
  renderTable();
  refreshMarkerClasses();
}

/* ----- Carrousel d'avis (page Professionnels) ----- */
function initProReviews() {
  const carousel = document.getElementById("pro-reviews");
  if (!carousel) return;
  const track = carousel.querySelector(".testi-track");
  const controls = carousel.querySelector(".testi-controls");
  const dotsWrap = carousel.querySelector(".testi-dots");
  const arrows = carousel.querySelectorAll(".testi-arrow");
  if (!track) return;

  let pages = 1, index = 0, paused = false;

  function syncDots() {
    if (!dotsWrap) return;
    dotsWrap.querySelectorAll(".testi-dot").forEach((d, i) => d.classList.toggle("is-active", i === index));
  }
  function goTo(i) {
    index = (i + pages) % pages;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
    syncDots();
  }
  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    for (let i = 0; i < pages; i++) {
      const b = document.createElement("button");
      b.className = "testi-dot" + (i === index ? " is-active" : "");
      b.setAttribute("aria-label", "Page d'avis " + (i + 1));
      b.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(b);
    }
  }
  function measure() {
    pages = Math.max(1, Math.round(track.scrollWidth / track.clientWidth));
    if (index > pages - 1) index = pages - 1;
    buildDots();
    if (controls) controls.style.display = pages > 1 ? "" : "none";
  }

  track.addEventListener("scroll", () => {
    index = Math.round(track.scrollLeft / track.clientWidth);
    syncDots();
  });
  arrows.forEach(a => a.addEventListener("click", () => goTo(index + Number(a.dataset.dir))));
  carousel.addEventListener("mouseenter", () => { paused = true; });
  carousel.addEventListener("mouseleave", () => { paused = false; });
  carousel.addEventListener("touchstart", () => { paused = true; }, { passive: true });

  setInterval(() => {
    if (paused || pages <= 1 || document.hidden) return;
    goTo(index + 1);
  }, 6000);

  measure();
  window.addEventListener("resize", measure);
}

/* ----- Formulaires : confirmation visuelle après envoi (Netlify Forms gère le POST) ----- */
function initForms() {
  document.querySelectorAll("form[data-success]").forEach(form => {
    form.addEventListener("submit", (e) => {
      // Si on est en local sans Netlify, on simule juste la confirmation pour pas envoyer dans le vide
      const isLocal = window.location.protocol === "file:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      if (isLocal) {
        e.preventDefault();
        const successId = form.dataset.success;
        const successEl = document.getElementById(successId);
        const toHide = form.closest("[data-form-wrapper]") || form;
        if (successEl) {
          toHide.style.display = "none";
          successEl.style.display = "";
        }
      }
      // Sinon (sur Netlify), on laisse Netlify Forms intercepter et rediriger.
    });
  });
}

/* ----- Boot ----- */
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initBurger();
  initFooterYear();
  initHomeMap();
  initContactMap();
  initPointsDeVente();
  initProReviews();
  initForms();
});
