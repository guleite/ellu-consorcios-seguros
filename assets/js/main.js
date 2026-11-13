/* =========================================================
   ELLÜ CONSÓRCIOS + SEGUROS — scripts compartilhados
   - cabeçalho, rodapé e ícones
   - menu (mega dropdown), animações de entrada
   - cards com inclinação 3D, confete das bolinhas do "ü"
   - WhatsApp flutuante com mini-chat
   ========================================================= */

/* ---------- Layout: header + footer ---------- */
(function layout() {
  const h = document.querySelector("[data-header]");
  const active = h ? h.dataset.header : "";
  const svcFile = location.pathname.split("/").pop();
  const curSvc = new URLSearchParams(location.search).get("s");

  const mm = (id, cls = "") => {
    const s = SERVICES[id];
    return `<a class="mm-item ${cls} ${curSvc === id ? "is-active" : ""}" href="${svcUrl(id)}"><span class="ic">${ico(s.icon)}</span><span><b>${s.name}</b><small>${s.menu}</small></span></a>`;
  };

  if (h) {
    h.outerHTML = `
    <header class="site-header">
      <div class="container">
        <a href="home.html" class="brand" aria-label="Ellü Consórcios + Seguros — início">
          <img src="assets/img/logo-cream.png" alt="Ellü" width="633" height="387">
          <span class="brand__sub">Consórcios<br><b>+</b> Seguros</span>
        </a>
        <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span><span></span></button>
        <nav class="nav" aria-label="Principal">
          <a class="nav__link ${active === "inicio" ? "is-active" : ""}" href="home.html">Início</a>
          <div class="nav-drop">
            <button type="button" class="nav__link ${active === "consorcios" ? "is-active" : ""}" aria-expanded="false">Consórcios ${ICON.chev}</button>
            <div class="nav-drop__menu">
              <a class="mm-item ${svcFile === "consorcios.html" ? "is-active" : ""}" href="consorcios.html"><span class="ic">${ico("users")}</span><span><b>Como funciona</b><small>Entenda o consórcio em 1 minuto</small></span></a>
              ${CONSORCIOS.map((id) => mm(id)).join("")}
              <div class="mm-foot"><span><b>Simulador de consórcio</b>Descubra sua parcela em segundos</span><a class="btn btn--orange btn--sm" href="simulador.html">Simular ${ICON.arrow}</a></div>
            </div>
          </div>
          <div class="nav-drop">
            <button type="button" class="nav__link ${active === "seguros" ? "is-active" : ""}" aria-expanded="false">Seguros ${ICON.chev}</button>
            <div class="nav-drop__menu">
              ${SEGUROS.map((id) => mm(id, "mm-item--seg")).join("")}
              <div class="mm-foot"><span><b>Cotação em várias seguradoras</b><a href="seguros.html" style="text-decoration:underline;text-underline-offset:3px">Ver todos os seguros</a></span><a class="btn btn--orange btn--sm" href="cotacao.html?g=seguro">Cotar seguro ${ICON.arrow}</a></div>
            </div>
          </div>
          <a class="nav__link ${active === "sobre" ? "is-active" : ""}" href="sobre.html">Sobre a Ellü</a>
          <a class="nav__link ${active === "contato" ? "is-active" : ""}" href="contato.html">Contato</a>
          <span class="front-switch" aria-label="Frentes da Ellü">
            <a href="${ELLU.rhSite}" title="Ir para Ellü RH + Departamento Pessoal">RH + DP ${ICON.ext}</a>
            <a href="home.html" class="is-on" aria-current="true">Consórcios + Seguros</a>
          </span>
          <a href="simulador.html" class="btn btn--orange ${active === "simulador" ? "is-active" : ""}">Simular agora</a>
        </nav>
      </div>
    </header>`;
  }

  const f = document.querySelector("[data-footer]");
  if (f) {
    f.outerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a href="home.html" class="brand"><img src="assets/img/logo-cream.png" alt="Ellü" width="633" height="387"><span class="brand__sub">Consórcios<br><b>+</b> Seguros</span></a>
            <p style="max-width:24em">Consultoria em consórcios e seguros com o olhar humano da Ellü: planejamento para conquistar e proteção para quem você ama.</p>
            <div class="socials">
              <a href="${ELLU.insta}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.insta}</a>
              <a href="#" aria-label="LinkedIn">${ICON.linkedin}</a>
              <a href="${waLink("Olá, Ellü! Vim pelo site de Consórcios + Seguros.")}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICON.wa}</a>
            </div>
            <a class="footer-other" href="${ELLU.rhSite}">
              <img src="assets/img/logo-cream.png" alt="">
              <span><small>Conheça também</small><b>Ellü RH + Departamento Pessoal</b></span>${ICON.ext}
            </a>
          </div>
          <div><h4>Consórcios</h4><ul><li><a href="consorcios.html">Como funciona</a></li>${CONSORCIOS.map((id) => `<li><a href="${svcUrl(id)}">${SERVICES[id].name}</a></li>`).join("")}<li><a href="simulador.html">Simulador</a></li></ul></div>
          <div><h4>Seguros</h4><ul><li><a href="seguros.html">Todos os seguros</a></li>${SEGUROS.map((id) => `<li><a href="${svcUrl(id)}">${SERVICES[id].name}</a></li>`).join("")}</ul></div>
          <div><h4>Fale com a gente</h4><ul>
            <li><a href="${waLink("Olá, Ellü! Vim pelo site de Consórcios + Seguros.")}" target="_blank" rel="noopener">WhatsApp ${ELLU.whatsLabel}</a></li>
            <li><a href="mailto:${ELLU.email}">${ELLU.email}</a></li>
            <li>${ELLU.city}</li>
            <li>Seg. a sex., das 8h às 18h</li>
            <li><a href="cotacao.html">Solicitar cotação</a></li>
            <li><a href="index.html">Portal Ellü</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom"><span>© <span data-year></span> Ellü Performance · Consórcios + Seguros. Todos os direitos reservados.</span><span>Proposta de layout desenvolvida por Concept Agência</span></div>
      </div>
    </footer>`;
  }
})();

/* ---------- Ícones declarativos: <i data-ico="house"></i> ---------- */
function hydrateIcons(root = document) {
  root.querySelectorAll("[data-ico]").forEach((el) => { if (!el.firstChild) el.innerHTML = ico(el.dataset.ico); });
}
hydrateIcons();

/* ---------- Header / menu / reveal ---------- */
(function ui() {
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-solid", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.classList.toggle("modal-open", open);
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("is-open"); toggle.classList.remove("is-open"); document.body.classList.remove("modal-open");
    }));
  }

  const drops = document.querySelectorAll(".nav-drop");
  const closeDrop = (d) => { d.classList.remove("is-open"); d.querySelector("button").setAttribute("aria-expanded", "false"); };
  drops.forEach((d) => {
    const btn = d.querySelector("button");
    btn.addEventListener("click", () => {
      const open = !d.classList.contains("is-open");
      drops.forEach(closeDrop);
      d.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open);
    });
  });
  document.addEventListener("click", (e) => drops.forEach((d) => { if (!d.contains(e.target)) closeDrop(d); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") drops.forEach(closeDrop); });

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  window.observeReveal = (root = document) => {
    root.querySelectorAll(".reveal:not(.is-in)").forEach((el) => {
      io.observe(el);
      // o que já está na primeira dobra entra de imediato (sem depender do observer)
      if (el.getBoundingClientRect().top < innerHeight * 0.95) requestAnimationFrame(() => el.classList.add("is-in"));
    });
  };
  observeReveal();
  setTimeout(() => document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in"); }), 400);

  document.querySelectorAll("[data-year]").forEach((y) => (y.textContent = new Date().getFullYear()));
})();

/* ---------- Confete com as bolinhas do "ü" ---------- */
const CALM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function burst(x, y, colors = ["#F46F14", "#FF9A4D", "#F2A93B", "#013A36", "#8FD1BA"], n = 14) {
  if (CALM) return;
  for (let i = 0; i < n; i++) {
    const d = document.createElement("span");
    d.className = "burst";
    d.style.left = x + "px"; d.style.top = y + "px";
    d.style.background = colors[i % colors.length];
    document.body.appendChild(d);
    const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    d.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist + 24}px) scale(.2)`, opacity: 0 },
    ], { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.22,1,.36,1)" }).onfinish = () => d.remove();
  }
}

/* ---------- Inclinação 3D + luz que segue o cursor ---------- */
function bindTilt(root = document) {
  root.querySelectorAll("[data-tilt]").forEach((el) => {
    if (el._tilt) return; el._tilt = true;
    const max = +el.dataset.tilt || 8;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", px * 100 + "%");
      el.style.setProperty("--my", py * 100 + "%");
      if (CALM || e.pointerType !== "mouse") return;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", (px - 0.5) * max + "deg");
      el.style.setProperty("--rx", (0.5 - py) * max + "deg");
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
    });
  });
  // No celular, os cards com selinho se animam sozinhos ao aparecer
  if (!CALM && !window.matchMedia("(hover: hover)").matches) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      setTimeout(() => { el.classList.add("is-play"); setTimeout(() => el.classList.remove("is-play"), 2200); }, 300);
      io.unobserve(el);
    }), { threshold: 0.6 });
    root.querySelectorAll(".icard").forEach((el) => io.observe(el));
  }
}
bindTilt();

/* ---------- Abas genéricas: [data-tabs] > [data-tab] + [data-pane] ---------- */
document.querySelectorAll("[data-tabs]").forEach((wrap) => {
  const tabs = wrap.querySelectorAll("[data-tab]");
  const panes = wrap.querySelectorAll("[data-pane]");
  const pill = wrap.querySelector(".pill");
  const set = (i) => {
    tabs.forEach((t, j) => { t.classList.toggle("is-on", i === j); t.setAttribute("aria-selected", i === j); });
    panes.forEach((p, j) => p.classList.toggle("is-on", i === j));
    const bar = tabs[0].parentElement;
    bar.dataset.on = i;
    if (pill) { pill.style.width = tabs[i].offsetWidth + "px"; pill.style.transform = `translateX(${tabs[i].offsetLeft - 5}px)`; }
  };
  tabs.forEach((t, i) => t.addEventListener("click", () => set(i)));
  set(0);
  window.addEventListener("resize", () => set([...tabs].findIndex((t) => t.classList.contains("is-on"))));
  if (document.fonts) document.fonts.ready.then(() => set([...tabs].findIndex((t) => t.classList.contains("is-on"))));
});

/* ---------- WhatsApp flutuante com mini-chat ---------- */
(function waChat() {
  if (document.body.dataset.nowa !== undefined) return;
  const opts = [
    ["🏠", "Quero simular um consórcio", "Olá, Ellü! Quero simular um consórcio."],
    ["🛡️", "Quero cotar um seguro", "Olá, Ellü! Quero fazer a cotação de um seguro."],
    ["💬", "Tenho uma dúvida", "Olá, Ellü! Tenho uma dúvida sobre consórcios e seguros."],
    ["🤝", "Sou cliente Ellü RH", "Olá, Ellü! Já sou cliente de RH e quero conhecer consórcios e seguros."],
  ];
  const el = document.createElement("div");
  el.className = "wa";
  el.innerHTML = `
    <div class="wa__chat" role="dialog" aria-label="Atendimento Ellü">
      <div class="wa__top"><span class="av"><img src="assets/img/cintia-1.jpg" alt=""></span><div><b>Time Ellü</b><small>Online agora · responde rapidinho</small></div></div>
      <div class="wa__body">
        <div class="wa__msg">Oi! 👋 Que bom te ver por aqui.</div>
        <div class="wa__msg">Como podemos te ajudar hoje?</div>
        <div class="wa__opts">${opts.map(([em, t, msg]) => `<a href="${waLink(msg + " (vim pelo site)")}" target="_blank" rel="noopener"><span class="em">${em}</span>${t}</a>`).join("")}</div>
      </div>
    </div>
    <span class="wa__bubble"><b>Oi! 👋</b> Quer simular um consórcio ou cotar um seguro?</span>
    <button class="wa__btn" aria-label="Falar com a Ellü pelo WhatsApp" aria-expanded="false"><span class="w">${ICON.wa}</span><span class="x">${ICON.close}</span><i>1</i></button>`;
  document.body.appendChild(el);
  const btn = el.querySelector(".wa__btn");
  btn.addEventListener("click", () => {
    const open = el.classList.toggle("is-open");
    el.classList.add("seen");
    btn.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", (e) => { if (!el.contains(e.target)) el.classList.remove("is-open"); });
  setTimeout(() => el.classList.add("show-bubble"), 4500);
  setTimeout(() => el.classList.remove("show-bubble"), 14000);
})();

/* ---------- Números que contam (data-count) ---------- */
function tween(from, to, dur, step) {
  if (CALM) return step(to);
  const t0 = performance.now();
  setTimeout(() => step(to), dur + 80); // garante o valor final mesmo com a aba em segundo plano
  const run = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    step(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

/* ---------- Roda do grupo de consórcio (página Consórcios) ---------- */
(function groupWheel() {
  const wheel = document.querySelector(".group-wheel");
  if (!wheel) return;
  const N = 12, people = [];
  const icons = ["user", "users", "user", "user", "users", "user", "user", "users", "user", "user", "users", "user"];
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 * i) / N - Math.PI / 2;
    const p = document.createElement("span");
    p.className = "gw-p";
    p.style.left = 50 + Math.cos(a) * 42 + "%";
    p.style.top = 50 + Math.sin(a) * 42 + "%";
    p.innerHTML = ico(icons[i]);
    wheel.appendChild(p);
    people.push(p);
  }
  const flag = document.createElement("span");
  flag.className = "gw-flag";
  wheel.appendChild(flag);
  const labels = ["Contemplado por sorteio! 🎉", "Contemplado por lance! 🎯"];
  let round = 0, done = [];
  const tick = () => {
    const pool = people.filter((p) => !done.includes(p));
    if (!pool.length) { done = []; people.forEach((p) => p.classList.remove("is-done")); return; }
    const p = pool[Math.floor(Math.random() * pool.length)];
    // "roleta": destaque passa por alguns antes de parar
    let hops = 6 + Math.floor(Math.random() * 4), i = 0;
    const spin = setInterval(() => {
      people.forEach((x) => x.classList.remove("is-lit"));
      const q = i < hops ? pool[Math.floor(Math.random() * pool.length)] : p;
      q.classList.add("is-lit");
      if (i >= hops) {
        clearInterval(spin);
        flag.textContent = labels[round % 2];
        flag.style.left = p.style.left; flag.style.top = p.style.top;
        flag.classList.add("show");
        setTimeout(() => {
          flag.classList.remove("show"); p.classList.remove("is-lit"); p.classList.add("is-done"); done.push(p); round++;
        }, 1800);
      }
      i++;
    }, 110);
  };
  let timer;
  new IntersectionObserver(([en]) => {
    clearInterval(timer);
    if (en.isIntersecting && !CALM) { tick(); timer = setInterval(tick, 3600); }
  }, { threshold: 0.4 }).observe(wheel);
})();

/* ---------- Quiz de proteção (página Seguros) ---------- */
(function quiz() {
  const box = document.querySelector("[data-quiz]");
  if (!box) return;
  const RULES = {
    carro: { seguro: ["seguro-auto", 3, "Você tem carro: proteção contra colisão, roubo e terceiros."] },
    filhos: { seguro: ["seguro-vida", 3, "Tem gente que depende de você: o seguro de vida garante o futuro deles."] },
    casa: { seguro: ["seguro-residencial", 2, "Sua casa e seus bens merecem proteção — e a assistência 24h ajuda no dia a dia."] },
    aluguel: { seguro: ["seguro-residencial", 2, "Mesmo de aluguel, seus bens e sua responsabilidade precisam de cobertura."] },
    empresa: { seguro: ["seguro-empresarial", 3, "Seu negócio precisa de proteção de patrimônio, operação e equipe."] },
    equipe: { seguro: ["seguro-saude", 3, "Plano de saúde e vida em grupo são benefícios que retêm talentos."] },
    viaja: { seguro: ["seguro-viagem", 2, "Viaja com frequência? Despesas médicas no exterior podem sair caro."] },
    autonomo: { seguro: ["seguro-vida", 2, "Sem renda garantida em caso de afastamento? Diárias por incapacidade ajudam."] },
    saude: { seguro: ["seguro-saude", 2, "Rede credenciada e cobertura certa para cuidar da saúde com tranquilidade."] },
  };
  const out = box.querySelector(".quiz__result");
  const chips = box.querySelectorAll(".qz");
  const empty = out.innerHTML;
  const render = () => {
    const on = [...chips].filter((c) => c.classList.contains("is-on")).map((c) => c.dataset.k);
    if (!on.length) { out.innerHTML = empty; return; }
    const score = {};
    on.forEach((k) => { const [id, w, why] = RULES[k].seguro; score[id] = score[id] || { w: 0, why: [] }; score[id].w += w; score[id].why.push(why); });
    const list = Object.entries(score).sort((a, b) => b[1].w - a[1].w);
    out.innerHTML = `<h3><span class="plus-mark plus-mark--mint" style="font-size:16px"></span> Seu mapa de proteção</h3>
      <p class="muted" style="font-size:.9rem">Com base no que você marcou, estas são as proteções que fazem mais sentido agora:</p>
      ${list.map(([id, v], i) => {
        const s = SERVICES[id];
        const lvl = v.w >= 3 ? ["Prioridade", ""] : v.w >= 2 ? ["Recomendado", " lvl--m"] : ["Considere", " lvl--l"];
        return `<a class="rec" href="${svcUrl(id)}" style="animation-delay:${i * 0.08}s"><span class="ic">${ico(s.icon)}</span><span><b>${s.name}</b><small>${v.why[0]}</small></span><span class="lvl${lvl[1]}">${lvl[0]}</span></a>`;
      }).join("")}
      <button class="btn btn--orange btn--block" data-cotar="${list[0][0]}">Cotar ${SERVICES[list[0][0]].name} ${ICON.arrow}</button>`;
  };
  chips.forEach((c) => c.addEventListener("click", (e) => {
    c.classList.toggle("is-on");
    if (c.classList.contains("is-on")) burst(e.clientX, e.clientY, ["#1E8A6B", "#8FD1BA", "#F46F14", "#F2A93B"], 10);
    render();
  }));
})();

/* ---------- Abas de contemplação (sorteio / lance) ---------- */
document.querySelectorAll("[data-ctabs]").forEach((w) => {
  const tabs = w.querySelectorAll(".ctab"), panes = w.querySelectorAll(".ctab__pane");
  tabs.forEach((t, i) => t.addEventListener("click", () => {
    tabs.forEach((x, j) => x.classList.toggle("is-on", i === j));
    panes.forEach((x, j) => x.classList.toggle("is-on", i === j));
  }));
});

/* ---------- Confete ao clicar em botões principais ---------- */
document.addEventListener("click", (e) => {
  const b = e.target.closest(".btn--orange, .qchip, .obj");
  if (b && e.clientX) burst(e.clientX, e.clientY, undefined, 10);
});
