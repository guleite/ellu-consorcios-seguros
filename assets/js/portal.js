/* =========================================================
   PORTAL ELLÜ — interações da página de escolha
   - parallax dos círculos e brilho que segue o cursor
   - os pontos do "ü" viram olhinhos que acompanham o mouse
   - cards com inclinação 3D, luz e expansão no hover
   - transição circular na cor da frente escolhida
   ========================================================= */
(function portal() {
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover)").matches;

  document.querySelectorAll("[data-ico]").forEach((el) => (el.innerHTML = ico(el.dataset.ico)));
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  document.querySelectorAll("[data-wa]").forEach((a) => { a.href = waLink("Olá, Ellü! Vim pelo site."); a.target = "_blank"; a.rel = "noopener"; });

  const cards = [...document.querySelectorAll(".pt-card")];
  const glow = document.querySelector(".pt-glow");
  const circles = [...document.querySelectorAll(".pt-c")];
  const eyes = [...document.querySelectorAll(".pt-eyes i")];

  cards.forEach((c) => c.addEventListener("animationend", () => c.classList.add("is-ready"), { once: true }));

  /* ---------- olhinhos ---------- */
  let look = { x: innerWidth / 2, y: innerHeight * 0.9 };
  const aim = (x, y) => {
    eyes.forEach((eye) => {
      const r = eye.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const a = Math.atan2(y - cy, x - cx);
      const d = Math.min(1, Math.hypot(x - cx, y - cy) / 160);
      const max = r.width * 0.26;
      eye.firstElementChild.style.transform = `translate(${Math.cos(a) * max * d}px, ${Math.sin(a) * max * d}px)`;
    });
  };

  /* ---------- mouse: brilho, parallax e olhos ---------- */
  let raf = 0, mx = innerWidth / 2, my = innerHeight / 2;
  const frame = () => {
    raf = 0;
    glow.style.transform = `translate(${mx - innerWidth / 2}px, ${my - innerHeight / 2}px)`;
    if (!calm) {
      const nx = mx / innerWidth - 0.5, ny = my / innerHeight - 0.5;
      circles.forEach((c) => { const k = +c.dataset.depth; c.style.transform = `translate(${nx * k}px, ${ny * k}px)`; });
    }
    aim(mx, my);
  };
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    document.body.classList.add("has-mouse");
    mx = e.clientX; my = e.clientY;
    if (!raf) raf = requestAnimationFrame(frame);
  });
  glow.style.left = "50%"; glow.style.top = "50%";

  // Sem mouse (celular): os olhinhos passeiam sozinhos
  if (!finePointer && !calm) {
    const spots = () => [
      { x: innerWidth * 0.2, y: innerHeight * 0.3 }, { x: innerWidth * 0.8, y: innerHeight * 0.3 },
      { x: innerWidth * 0.5, y: innerHeight * 0.95 }, { x: innerWidth * 0.5, y: 0 },
    ];
    let k = 0;
    setInterval(() => { const s = spots()[k++ % 4]; aim(s.x, s.y); }, 1600);
  }
  setTimeout(() => aim(look.x, look.y), 1200);

  /* ---------- cards: tilt + luz + estado de hover ---------- */
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%");
      card.style.setProperty("--my", py * 100 + "%");
      if (calm || e.pointerType !== "mouse") return;
      card.classList.add("is-tilting");
      card.style.setProperty("--ry", (px - 0.5) * 6 + "deg");
      card.style.setProperty("--rx", (0.5 - py) * 6 + "deg");
    });
    const enter = () => document.body.classList.add("hov-" + card.dataset.side);
    const leave = () => {
      document.body.classList.remove("hov-" + card.dataset.side);
      card.classList.remove("is-tilting");
      card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg");
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focus", () => {
      enter();
      const r = card.getBoundingClientRect();
      aim(r.left + r.width / 2, r.top + r.height / 2);
    });
    card.addEventListener("blur", leave);

    /* ---------- transição ao escolher ---------- */
    card.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      go(card, e.clientX || null, e.clientY || null);
    });
  });

  function go(card, x, y) {
    const wipe = document.querySelector(".pt-wipe");
    const r = card.getBoundingClientRect();
    wipe.style.setProperty("--x", (x ?? r.left + r.width / 2) + "px");
    wipe.style.setProperty("--y", (y ?? r.top + r.height / 2) + "px");
    wipe.style.background = card.dataset.color;
    wipe.querySelector(".pt-wipe__txt").innerHTML = `Abrindo ${card.dataset.label} <i></i><i></i><i></i>`;
    if (card.dataset.side === "cs") { try { sessionStorage.setItem("ellu-from-portal", "1"); } catch (err) {} }
    if (calm) { location.href = card.href; return; }
    requestAnimationFrame(() => wipe.classList.add("go"));
    setTimeout(() => (location.href = card.href), 1050);
  }

  // Voltar pelo navegador (bfcache): desfaz a cortina
  window.addEventListener("pageshow", (e) => { if (e.persisted) document.querySelector(".pt-wipe").classList.remove("go"); });

  /* ---------- teclado: ← → para alternar entre as frentes ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const i = cards.indexOf(document.activeElement);
    const n = e.key === "ArrowLeft" ? 0 : 1;
    cards[i === -1 ? n : n].focus();
  });
})();
