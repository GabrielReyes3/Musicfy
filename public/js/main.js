const SW_LOCATION = "/sw.js";
const PLAYLISTS_CONTAINER = document.getElementById("playlists");
const SPLASH = document.getElementById("splash");
const APP = document.getElementById("app");
const favoritesKey = "musicfy:favorites";

// Registrar Service Worker
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register(SW_LOCATION);
      console.log("Service Worker registered");
    } catch (err) {
      console.error("SW registration failed", err);
    }
  }
}

// Ocultar splash y mostrar app
function hideSplashAndInit() {
  setTimeout(() => {
    SPLASH.style.display = "none";  
    APP.classList.remove("hidden");  
    init();
  }, 1200);
}

async function init() {
  await registerSW();
  bindUI();
  loadPlaylists();
  renderFavorites();
}

// Lista extendida (~30 artistas)
const seeds = [
  { id: "leny", name: "Lenny Kravitz" },
  { id: "jamiroquai", name: "Jamiroquai" },
  { id: "robbie", name: "Robbie Williams" },
  { id: "robzombie", name: "Rob Zombie" },
  { id: "metallica", name: "Metallica" },
  { id: "nirvana", name: "Nirvana" },
  { id: "queen", name: "Queen" },
  { id: "michael", name: "Michael Jackson" },
  { id: "madonna", name: "Madonna" },
  { id: "prince", name: "Prince" },
  { id: "daftpunk", name: "Daft Punk" },
  { id: "gorillaz", name: "Gorillaz" },
  { id: "coldplay", name: "Coldplay" },
  { id: "radiohead", name: "Radiohead" },
  { id: "linkinpark", name: "Linkin Park" },
  { id: "rammstein", name: "Rammstein" },
  { id: "slipknot", name: "Slipknot" },
  { id: "adele", name: "Adele" },
  { id: "beyonce", name: "Beyoncé" },
  // { id: "brunomars", name: "Bruno Mars" },
  { id: "weeknd", name: "The Weeknd" },
  { id: "drake", name: "Drake" },
  { id: "eminem", name: "Eminem" },
  { id: "kendrick", name: "Kendrick Lamar" },
  { id: "bobmarley", name: "Bob Marley" },
  { id: "rolling", name: "The Rolling Stones" },
  { id: "beatles", name: "The Beatles" },
  { id: "arctic", name: "Arctic Monkeys" },
  { id: "redhot", name: "Red Hot Chili Peppers" },
  // { id: "oasis", name: "Oasis" }
];

// Fetch playlists por artista
async function fetchPlaylists() {
  const results = [];
  for (const s of seeds) {
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(s.name)}&entity=song&limit=6`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        let artwork = data.results[0].artworkUrl100 || data.results[0].artworkUrl600;
        if (artwork) {
          // convertir a 1200px HD
          artwork = artwork.replace("100x100bb", "1200x1200bb")
                           .replace("600x600bb", "1200x1200bb");
        }
        results.push({
          id: s.id,
          title: s.name,
          artwork: artwork,
          seed: s.name
        });
      }
    } catch (err) {
      console.warn("Fetch failed for", s.name, err);
    }
  }
  return results;
}

// Cargar playlists y renderizar
async function loadPlaylists() {
  PLAYLISTS_CONTAINER.innerHTML = "<p>Cargando playlists...</p>";
  const playlists = await fetchPlaylists();
  if (!playlists.length) {
    PLAYLISTS_CONTAINER.innerHTML = "<p>No hay conexión. Mostrando cache si disponible.</p>";
    return;
  }
  PLAYLISTS_CONTAINER.innerHTML = "";
  playlists.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.artwork}" alt="${p.title}" />
      <h4>${p.title}</h4>
      <p>
        <button data-play="${p.seed}">Abrir playlist</button>
        <button data-fav="${p.seed}">❤</button>
      </p>
    `;
    PLAYLISTS_CONTAINER.appendChild(card);
  });

  PLAYLISTS_CONTAINER.querySelectorAll("[data-play]").forEach(b =>
    b.addEventListener("click", (e) => {
      const seed = e.target.dataset.play;
      window.location.href = `/playlist/${encodeURIComponent(seed)}`;
    })
  );

  PLAYLISTS_CONTAINER.querySelectorAll("[data-fav]").forEach(b =>
    b.addEventListener("click", (e) => {
      const seed = e.target.dataset.fav;
      toggleFavorite(seed);
    })
  );
}

// Local favorites
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(favoritesKey)) || [];
  } catch {
    return [];
  }
}
function setFavorites(list) {
  localStorage.setItem(favoritesKey, JSON.stringify(list));
  renderFavorites();
}

function toggleFavorite(seed) {
  const fav = getFavorites();
  const idx = fav.indexOf(seed);
  if (idx >= 0) {
    fav.splice(idx, 1);
    showToast(`${seed} eliminado de favoritos`);
  } else {
    fav.push(seed);
    showToast(`${seed} agregado a favoritos`);
  }
  setFavorites(fav);
}

function renderFavorites() {
  const favList = document.getElementById("favoritesList");
  favList.innerHTML = "";
  getFavorites().forEach(f => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${f}</strong> — <a href="/playlist/${encodeURIComponent(f)}">Abrir</a>`;
    favList.appendChild(li);
  });
}

// Toast
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style = "position:fixed;bottom:12px;left:12px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;z-index:9999";
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 2800);
}

// Notifications
async function requestAndNotify() {
  if (!("Notification" in window)) { alert("Notificaciones no soportadas"); return; }
  const perm = await Notification.requestPermission();
  if (perm === "granted") {
    new Notification("Musicfy", {
      body: "Gracias — notificaciones activadas. ¡Revisa las nuevas playlists!",
      icon: "/images/logo.png"
    });
  } else { alert("Permiso de notificaciones denegado"); }
}

// Mic
function startVoiceSearch() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    const sr = new SpeechRecognition();
    sr.lang = "es-ES";
    sr.onresult = (e) => {
      const t = e.results[0][0].transcript;
      showToast(`Buscando: ${t}`);
      window.location.href = `/playlist/${encodeURIComponent(t)}`;
    };
    sr.onerror = (err) => { alert("Error en reconocimiento de voz"); console.warn(err); };
    sr.start();
  } else if (navigator.mediaDevices?.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => { showToast("Micrófono activo (simulación)"); stream.getTracks().forEach(t => t.stop()); })
      .catch(()=> alert("No se pudo acceder al micrófono"));
  } else { alert("No hay soporte de micrófono disponible"); }
}

// Geolocation
function recommendByLocation() {
  if (!("geolocation" in navigator)) { alert("Geolocalización no soportada"); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude } = pos.coords;
      showToast(`Ubicación: ${latitude.toFixed(3)} — sugiriendo playlists locales.`);
      const seed = `local-${Math.round(Math.abs(latitude*10))}`;
      window.location.href = `/playlist/${encodeURIComponent(seed)}`;
    },
    (err) => alert("No se pudo obtener ubicación: " + err.message),
    { timeout: 8000 }
  );
}

// Bind UI
function bindUI() {
  document.getElementById("btn-voice").addEventListener("click", startVoiceSearch);
  document.getElementById("btn-location").addEventListener("click", recommendByLocation);
  document.getElementById("btn-notify").addEventListener("click", requestAndNotify);
}

// Start
hideSplashAndInit();
