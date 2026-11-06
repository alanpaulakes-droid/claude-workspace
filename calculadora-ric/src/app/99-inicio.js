  /* ===== Arranque ===== */
  document.documentElement.lang = "es";
  {
    const m = document.getElementById("app");
    if (m && !document.querySelector(".skip")) {
      m.tabIndex = -1;
      document.body.insertAdjacentHTML("afterbegin", '<a class="skip" href="#app">Saltar al contenido</a>');
    }
  }
  /* App instalable y sin conexión (PWA): solo cuando se publica en un sitio propio (https o localhost), fuera de visores embebidos. */
  try {
    const own = (location.protocol === "https:" || location.hostname === "localhost") && window.top === window && !/claude\.ai|claudeusercontent/.test(location.hostname);
    if (own && "serviceWorker" in navigator) {
      const l = document.createElement("link");
      l.rel = "manifest";
      l.href = "manifest.webmanifest";
      document.head.appendChild(l);
      navigator.serviceWorker.register("sw.js").catch(() => {
      });
    }
  } catch (e) {
  }
  render();
