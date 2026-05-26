/* =====================================================================
   Douceur des Collines — main.js
   Header scroll, burger menu, Leaflet maps, filtres POS, formulaires
   ===================================================================== */

/* ----- Données partagées (points de vente) ----- */
const FARM_LATLNG = [44.6770, 2.2330];

const POS_DATA = [
  // Supermarchés
  { id: "im-maurs",    kind: "super",    dept: "15", name: "Intermarché SUPER Saint-Étienne-de-Maurs", shortName: "Maurs",     town: "Saint-Étienne-de-Maurs", addr: "8 Av. d'Aurillac, 15600 Saint-Étienne-de-Maurs",        phone: "04 71 49 02 11", hours: "Lun–Sam 8h30–19h30", prods: "Yaourts nature & vanille", lat: 44.7137, lng: 2.1898 },
  { id: "im-flagnac",  kind: "super",    dept: "12", name: "Intermarché SUPER Flagnac",                shortName: "Flagnac",   town: "Flagnac",                addr: "RD 963 Lieu-dit La Planque, 12300 Flagnac",              phone: "05 65 64 88 04", hours: "Lun–Sam 8h30–19h30", prods: "Gamme complète",            lat: 44.5856, lng: 2.2789 },
  { id: "im-bagnac",   kind: "super",    dept: "46", name: "Intermarché CONTACT Bagnac-sur-Célé",      shortName: "Bagnac",    town: "Bagnac-sur-Célé",        addr: "Près de Blazy, Route d'Aurillac, 46270 Bagnac-sur-Célé", phone: "05 65 14 01 21", hours: "Lun–Sam 8h30–19h30", prods: "Yaourts nature & vanille", lat: 44.6738, lng: 2.1602 },
  { id: "im-figeac",   kind: "super",    dept: "46", name: "Intermarché SUPER Figeac",                 shortName: "Figeac",    town: "Figeac",                 addr: "15 Saint-Georges, Route de Cahors, 46100 Figeac",        phone: "05 65 50 02 14", hours: "Lun–Sam 8h30–20h",   prods: "Gamme complète",            lat: 44.6076, lng: 2.0344 },
  // Épiceries / fromagers
  { id: "entre-deux",  kind: "epicerie", dept: "15", name: "L'Entre Deux",                              shortName: "L'Entre Deux", town: "Saint-Santin-de-Maurs", addr: "Le Bourg, 15600 Saint-Santin-de-Maurs",                   phone: "04 71 49 30 02", hours: "Tlj sauf lun. 8h–12h30", prods: "Gamme complète",        lat: 44.6815, lng: 2.2410 },
  { id: "ginisty",     kind: "epicerie", dept: "12", name: "Boucherie Maison Ginisty",                  shortName: "Ginisty",    town: "Rodez",                   addr: "Place du Bourg, 12000 Rodez",                              phone: "05 65 68 16 64", hours: "Mar–Sam 8h–19h",    prods: "Yaourts & crème crue",      lat: 44.3520, lng: 2.5750 },
  { id: "morin",       kind: "epicerie", dept: "12", name: "Morin Fromager",                            shortName: "Morin",      town: "Rodez",                   addr: "R. Béteille, 12000 Rodez",                                 phone: "05 65 67 28 11", hours: "Mar–Sam 8h30–19h",  prods: "Crème crue",                lat: 44.3490, lng: 2.5780 },
  // Halles de l'Aveyron
  { id: "halles-rodez",   kind: "halles", dept: "12", name: "Les Halles de l'Aveyron — Rodez",                 shortName: "Rodez",   town: "Rodez",               addr: "Rte d'Espalion, 12000 Rodez",                            phone: "05 65 73 75 30", hours: "Tlj 9h–19h",      prods: "Gamme complète", lat: 44.3490, lng: 2.5733 },
  { id: "halles-issy",    kind: "halles", dept: "92", name: "Les Halles de l'Aveyron — Issy-les-Moulineaux",   shortName: "Issy",    town: "Issy-les-Moulineaux", addr: "Quai du Pdt Roosevelt, 92130 Issy-les-Moulineaux",       phone: "01 47 65 02 18", hours: "Mar–Dim 9h–19h",  prods: "Gamme complète", lat: 48.8244, lng: 2.2706 },
  { id: "halles-herblay", kind: "halles", dept: "95", name: "Les Halles de l'Aveyron — Herblay",               shortName: "Herblay", town: "Herblay-sur-Seine",  addr: "Rte de Conflans, 95220 Herblay-sur-Seine",               phone: "01 30 40 27 13", hours: "Mar–Dim 9h–19h",  prods: "Gamme complète", lat: 48.9897, lng: 2.1633 },
  // Marchés
  { id: "marche-figeac",       kind: "marche", dept: "46", name: "Marché de Figeac",       shortName: "Marché",      town: "Figeac",       addr: "Place Carnot, 46100 Figeac",  phone: "—", hours: "Sam. matin", prods: "Yaourts & crème crue", lat: 44.6076, lng: 2.0344 },
  { id: "marche-decazeville",  kind: "marche", dept: "12", name: "Marché de Decazeville",  shortName: "Decazeville", town: "Decazeville",  addr: "Place Wilson, 12300 Decazeville", phone: "—", hours: "Mar. matin", prods: "Gamme complète",     lat: 44.5582, lng: 2.2563 },
];

const CAT_META = {
  super:    { label: "Hypermarché / Supermarché", dotColor: "var(--sage)",   chipDot: "var(--sage)" },
  epicerie: { label: "Épicerie / Fromager",       dotColor: "var(--nature)", chipDot: "var(--nature)" },
  halles:   { label: "Halles de l'Aveyron",       dotColor: "var(--vanille)", chipDot: "var(--vanille)" },
  marche:   { label: "Marché / Ambulant",         dotColor: "var(--brown)",  chipDot: "var(--brown)" }
};

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
    attributionControl: false,
    scrollWheelZoom: interactive,
    dragging: interactive,
    doubleClickZoom: interactive,
    touchZoom: interactive,
    boxZoom: false,
    keyboard: false,
  }).setView(initialCenter, zoom);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    subdomains: "abcd",
    maxZoom: 19,
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
      html: '<span class="dot"></span><span class="lbl">' + (p.shortName || p.name) + '</span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
    const marker = L.marker([p.lat, p.lng], { icon }).addTo(map);
    if (onSelect) marker.on("click", () => onSelect(p.id));
    markers[p.id] = { marker, kind: p.kind };
  });

  // Auto-fit bounds
  const latlngs = [FARM_LATLNG, ...visible.filter(p => p.lat && p.lng).map(p => [p.lat, p.lng])];
  if (latlngs.length > 1) {
    const bounds = L.latLngBounds(latlngs);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
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

  // Init
  renderDetail();
  renderTable();
  refreshMarkerClasses();
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
  initForms();
});
