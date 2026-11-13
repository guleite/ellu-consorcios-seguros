/* =========================================================
   Página de serviço — monta a página de cada modalidade de
   consórcio ou seguro a partir do catálogo (data.js).
   servico.html?s=consorcio-imovel
   ========================================================= */
(function servicePage() {
  const root = document.querySelector("[data-service-page]");
  if (!root) return;
  const id = new URLSearchParams(location.search).get("s");
  const s = SERVICES[id] || SERVICES["consorcio-imovel"];
  const sid = SERVICES[id] ? id : "consorcio-imovel";
  const isSeg = s.group === "seguro";
  const groupName = isSeg ? "Seguros" : "Consórcios";
  const groupUrl = isSeg ? "seguros.html" : "consorcios.html";
  const arrow = `<i data-ico="arrow" style="width:1.15em;height:1.15em"></i>`;

  document.title = `${s.name} — Ellü Consórcios + Seguros`;
  const hdr = document.querySelector(".nav-drop:nth-of-type(" + (isSeg ? 2 : 1) + ") > .nav__link");
  if (hdr) hdr.classList.add("is-active");

  const related = (isSeg ? SEGUROS : CONSORCIOS).filter((k) => k !== sid);

  root.innerHTML = `
  <section class="page-hero page-hero--split grain on-dark ${isSeg ? "page-hero--seg" : ""}">
    <div class="container">
      <div class="ph-copy">
        <nav class="crumbs reveal" aria-label="Você está em"><a href="index.html">Início</a><span aria-hidden="true">›</span><a href="${groupUrl}">${groupName}</a><span aria-hidden="true">›</span><span>${s.name}</span></nav>
        <span class="eyebrow reveal">${isSeg ? '<span class="plus-mark plus-mark--mint"></span>' : '<span class="plus-mark"></span>'} ${s.name}</span>
        <h1 class="reveal" data-delay="1">${s.title}</h1>
        <p class="lead reveal" data-delay="2">${s.lead}</p>
        <div class="btn-row reveal" data-delay="3">
          ${isSeg
            ? `<a href="#cotar" class="btn btn--orange btn--lg">Cotar agora ${arrow}</a><a href="${waLink(`Olá, Ellü! Quero saber mais sobre ${s.name}. (vim pelo site)`)}" target="_blank" rel="noopener" class="btn btn--ghost btn--lg"><i data-ico="wa" style="width:1.2em;height:1.2em"></i> WhatsApp</a>`
            : `<a href="#simule" class="btn btn--orange btn--lg">Simular agora ${arrow}</a><a href="#cotar" class="btn btn--ghost btn--lg">Pedir proposta</a>`}
        </div>
      </div>
      <div class="ph-visual reveal" data-delay="2">
        <span class="ring"></span>
        <div class="arch"><img src="${UNSPLASH(s.img, 900)}" alt=""></div>
        <div class="float-card"><span class="ico ${isSeg ? "ico--teal" : ""}" data-ico="${s.icon}"></span><span><strong>${s.float[0]}</strong>${s.float[1]}</span></div>
      </div>
    </div>
    <svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true"><path fill="#FAF6F0" d="M0 70c180 40 360 50 560 20S960 0 1160 20s220 60 280 70v30H0z"/></svg>
  </section>

  <div class="container">
    <div class="facts">
      ${s.facts.map(([ic, b, t], i) => `<div class="fact ${isSeg ? "fact--seg" : ""} reveal" data-delay="${i}"><span class="ic" data-ico="${ic}"></span><span><b>${b}</b><span>${t}</span></span></div>`).join("")}
    </div>
  </div>

  <section class="sec">
    <div class="container">
      <div class="sec-head">
        <span class="eyebrow reveal"><span class="dots"></span> ${isSeg ? "Coberturas" : "Como usar"}</span>
        <h2 class="reveal" data-delay="1">${s.usesTitle}</h2>
      </div>
      <div class="uses ${isSeg ? "uses--seg" : ""}">
        ${s.uses.map(([ic, t], i) => `<div class="use reveal" data-delay="${i % 3}"><span class="ic" data-ico="${ic}"></span>${t}</div>`).join("")}
      </div>
    </div>
  </section>

  <section class="sec sec--cream">
    <div class="container split">
      <div class="photo-stack reveal">
        <div class="arch"><img src="${UNSPLASH(s.img2, 800)}" alt=""></div>
        <div class="mini"><img src="${UNSPLASH(s.img, 400)}" alt=""></div>
      </div>
      <div>
        <span class="eyebrow reveal"><span class="dots"></span> Por que com a Ellü</span>
        <h2 class="reveal" data-delay="1">${isSeg ? "Proteção explicada, <span class=\"hl\">sem letras miúdas</span>" : "Planejamento de verdade, <span class=\"hl\">não só uma cota</span>"}</h2>
        <ul class="check-list reveal" data-delay="2">${s.why.map((w) => `<li><span>${w}</span></li>`).join("")}</ul>
        <div class="btn-row reveal" data-delay="3">
          <a href="#cotar" class="btn btn--green">${isSeg ? "Quero minha cotação" : "Quero uma proposta"} ${arrow}</a>
        </div>
      </div>
    </div>
  </section>

  ${isSeg ? "" : `
  <section class="sec" id="simule">
    <div class="container">
      <div class="sec-head">
        <span class="eyebrow reveal"><span class="plus-mark"></span> Simulação rápida</span>
        <h2 class="reveal" data-delay="1">Quanto fica a parcela do seu <span class="hl">${s.short.toLowerCase()}</span>?</h2>
        <p class="reveal" data-delay="2">Arraste o valor e escolha o prazo. Se gostar, peça a proposta real com um clique.</p>
      </div>
      <div class="reveal" data-delay="1"><div data-sim="${sid}" data-compact data-fixed></div></div>
    </div>
  </section>`}

  <section class="sec ${isSeg ? "" : "sec--cream"}" id="cotar">
    <div class="container contact-grid">
      <div class="aside-card grain on-dark reveal">
        <span class="eyebrow"><span class="plus-mark"></span> ${isSeg ? "Cotação gratuita" : "Proposta sem compromisso"}</span>
        <h3>${isSeg ? "Em poucos minutos você pede, a Ellü compara." : "Conte seu plano e receba uma proposta real."}</h3>
        <p>${isSeg ? "Preencha os dados ao lado e nossa equipe cota nas principais seguradoras do mercado." : "Analisamos os grupos disponíveis nas administradoras parceiras e montamos a melhor estratégia para você."}</p>
        <div class="aside-steps">
          <div><span class="n">1</span><span><b>Você envia</b><span>Leva menos de 2 minutos.</span></span></div>
          <div><span class="n">2</span><span><b>A Ellü analisa</b><span>${isSeg ? "Comparamos coberturas e preços." : "Selecionamos grupos e simulamos lances."}</span></span></div>
          <div><span class="n">3</span><span><b>Você decide</b><span>Recebe as opções no WhatsApp, com tudo explicado.</span></span></div>
        </div>
      </div>
      <div class="qw-card reveal" data-delay="1"><div data-wizard="${sid}" data-lock data-origem="página ${s.name}"></div></div>
    </div>
  </section>

  <section class="sec ${isSeg ? "sec--cream" : ""}">
    <div class="container">
      <div class="sec-head center">
        <span class="eyebrow reveal"><span class="dots"></span> Dúvidas frequentes</span>
        <h2 class="reveal" data-delay="1">O que mais perguntam sobre <span class="hl">${s.name}</span></h2>
      </div>
      <div class="faq">${s.faq.map(([q, a]) => `<details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>
    </div>
  </section>

  <section class="sec sec--tight ${isSeg ? "" : "sec--cream"}">
    <div class="container">
      <div class="sec-head sec-head--row" style="margin-bottom:30px">
        <div><span class="eyebrow reveal"><span class="dots"></span> Veja também</span><h2 class="reveal" data-delay="1" style="font-size:clamp(1.6rem,2.6vw,2.2rem)">Outros ${isSeg ? "seguros" : "consórcios"}</h2></div>
        <a href="${groupUrl}" class="link-arrow reveal">Ver todos <i data-ico="arrow"></i></a>
      </div>
      <div class="related">${related.slice(0, 4).map((k) => `<a class="rel reveal" href="${svcUrl(k)}"><span class="ic" data-ico="${SERVICES[k].icon}"></span>${SERVICES[k].name}</a>`).join("")}</div>
    </div>
  </section>

  <section class="sec sec--orange grain cta-band">
    <div class="bubbles" aria-hidden="true"><span style="width:420px;height:420px;left:-120px;top:-160px"></span><span style="width:300px;height:300px;right:6%;bottom:-140px"></span></div>
    <div class="container" style="position:relative">
      <span class="eyebrow reveal"><span class="plus-mark"></span> ${isSeg ? "Proteja agora" : "Comece hoje"}</span>
      <h2 class="reveal" data-delay="1">${isSeg ? "Tranquilidade custa menos do que você imagina." : "Seu plano merece começar com o pé direito."}</h2>
      <p class="reveal" data-delay="2">${isSeg ? "Peça sua cotação e compare opções de várias seguradoras, com a orientação da Ellü." : "Simule, tire dúvidas e receba uma proposta real — sem compromisso."}</p>
      <div class="btn-row reveal" data-delay="3">
        <a href="#cotar" class="btn btn--green btn--lg">${isSeg ? "Cotar " + s.name : "Pedir proposta"} ${arrow}</a>
        <a href="${waLink(`Olá, Ellü! Quero conversar sobre ${s.name}. (vim pelo site)`)}" target="_blank" rel="noopener" class="btn btn--cream btn--lg">Falar no WhatsApp</a>
      </div>
    </div>
  </section>`;

  hydrateIcons(root);
  if (window.observeReveal) observeReveal(root);
})();
