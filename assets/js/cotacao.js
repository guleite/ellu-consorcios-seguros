/* =========================================================
   Cotação em etapas — campos adaptados ao serviço escolhido.
   Usada inline (cotacao.html, páginas de serviço, contato) e
   em modal: qualquer elemento com data-cotar="<id|consorcio|seguro>".
   ========================================================= */

class QuoteWizard {
  constructor(root, opts = {}) {
    this.root = root;
    this.o = opts;
    this.data = { ...(opts.preset || {}) };
    this.service = SERVICES[opts.service] ? opts.service : null;
    this.filter = opts.filter || (opts.service && !SERVICES[opts.service] ? opts.service : null); // "consorcio" | "seguro"
    this.lockService = !!this.service && opts.lock !== false;
    root.addEventListener("click", (e) => this.onClick(e));
    root.addEventListener("input", (e) => this.onInput(e));
    this.render();
  }

  get steps() { return this.lockService ? ["det", "dados"] : ["svc", "det", "dados"]; }

  render() {
    this.cur = 0;
    const st = this.steps;
    this.root.innerHTML = `
      <div class="qw">
        <div class="qw__head"></div>
        <div class="qw-progress">${st.map(() => "<i></i>").join("")}</div>
        <div class="qw-progress--labels">${st.map((s) => `<span>${{ svc: "Serviço", det: "Detalhes", dados: "Seus dados" }[s]}</span>`).join("")}</div>
        <form novalidate autocomplete="on">
          ${st.includes("svc") ? `<div class="qw-step" data-s="svc">${this.svcStep()}</div>` : ""}
          <div class="qw-step" data-s="det"></div>
          <div class="qw-step" data-s="dados">${this.contactStep()}</div>
          <div class="qw-step qdone" data-s="done"></div>
          <p class="qerr" aria-live="polite"></p>
          <div class="qw-nav">
            <button type="button" class="qback" hidden>${ICON.back} Voltar</button>
            <button type="submit" class="btn btn--orange qnext">Continuar ${ICON.arrow}</button>
          </div>
        </form>
        <p class="qprivacy">${ICON.lock} Seus dados ficam só com a Ellü, conforme a LGPD. Zero spam.</p>
      </div>`;
    this.form = this.root.querySelector("form");
    this.form.addEventListener("submit", (e) => { e.preventDefault(); this.next(); });
    this.root.querySelector(".qback").addEventListener("click", () => this.back());
    if (this.service) this.buildDetails();
    this.head();
    this.show(0);
  }

  head() {
    const h = this.root.querySelector(".qw__head");
    const s = this.service && SERVICES[this.service];
    if (!s) {
      h.innerHTML = `<span class="ic">${ICON.chat}</span><span><small>Cotação gratuita</small><b>Como a Ellü pode te ajudar?</b></span>`;
      return;
    }
    h.innerHTML = `<span class="ic ${s.group === "seguro" ? "ic--seg" : ""}">${ico(s.icon)}</span>
      <span><small>${s.group === "seguro" ? "Cotação de seguro" : "Proposta de consórcio"}</small><b>${s.name}</b></span>
      ${this.lockService && this.o.allowChange !== false ? `<button type="button" class="qchange">Trocar</button>` : ""}`;
  }

  svcStep() {
    const opt = (id) => {
      const s = SERVICES[id];
      return `<button type="button" class="svc-opt ${s.group === "seguro" ? "svc-opt--seg" : ""}" data-svc="${id}"><span class="ic">${ico(s.icon)}</span>${s.short === "Saúde" ? "Saúde e odonto" : s.short}</button>`;
    };
    const showC = this.filter !== "seguro", showS = this.filter !== "consorcio";
    return `<h3>O que você quer conquistar ou proteger?</h3>
      <p class="hint">Escolha o serviço e a gente adapta as próximas perguntas para você.</p>
      <div class="svc-pick">
        ${showC ? `<h4>Consórcios · conquistar</h4><div class="svc-grid">${CONSORCIOS.map(opt).join("")}</div>` : ""}
        ${showS ? `<h4>Seguros · proteger</h4><div class="svc-grid">${SEGUROS.map(opt).join("")}</div>` : ""}
      </div>`;
  }

  buildDetails() {
    const s = SERVICES[this.service];
    const el = this.root.querySelector('[data-s="det"]');
    let fields = [...s.fields];
    if (s.group === "consorcio") {
      const sim = s.sim;
      if (this.data.valor == null) this.data.valor = sim.def;
      if (!this.data.prazo) this.data.prazo = `${sim.defTerm} meses`;
      fields = [
        { id: "valor", type: "money", label: "Valor da carta de crédito", min: sim.min, max: sim.max, step: sim.step },
        { id: "prazo", type: "chips", label: "Prazo desejado", options: sim.terms.map((t) => `${t} meses`) },
        ...fields,
      ];
    }
    this.fields = fields;
    const title = s.group === "seguro" ? `Conte um pouco sobre o que você quer proteger` : `Vamos desenhar o seu plano`;
    const hint = s.group === "seguro" ? "Com essas informações cotamos nas principais seguradoras." : "Ajuste o valor e o prazo — a proposta final vem com as condições reais dos grupos disponíveis.";
    let html = `<h3>${title}</h3><p class="hint">${hint}</p>`;
    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      if (f.half && fields[i + 1] && fields[i + 1].half) { html += `<div class="fld-row">${this.field(f)}${this.field(fields[i + 1])}</div>`; i++; }
      else html += this.field(f);
    }
    el.innerHTML = html;
    el.querySelectorAll(".range").forEach((r) => this.paintRange(r));
  }

  field(f) {
    const v = this.data[f.id];
    const lbl = `${f.label}${f.hint ? ` <small>(${f.hint})</small>` : ""}`;
    if (f.type === "chips" || f.type === "multi") {
      const sel = (o) => (f.type === "multi" ? (v || []).includes(o) : v === o);
      return `<div class="fld" data-f="${f.id}"><span class="lbl">${lbl}</span><div class="pills" data-type="${f.type}" data-id="${f.id}">${f.options.map((o) => `<button type="button" data-v="${o}" class="${sel(o) ? "is-on" : ""}">${o}</button>`).join("")}</div></div>`;
    }
    if (f.type === "money") {
      return `<div class="fld" data-f="${f.id}"><span class="lbl">${lbl}</span>
        <div class="money"><small>R$</small><input type="text" inputmode="numeric" data-money="${f.id}" value="${(v || f.min).toLocaleString("pt-BR")}" aria-label="${f.label}"></div>
        <input type="range" class="range" data-range="${f.id}" min="${f.min}" max="${f.max}" step="${f.step}" value="${v || f.min}" aria-label="${f.label}">
        <div class="range-scale"><span>${BRL(f.min)}</span><span>${BRL(f.max)}</span></div></div>`;
    }
    const type = f.type === "date" ? "date" : "text";
    return `<div class="fld" data-f="${f.id}"><label for="qw-${f.id}">${lbl}</label><input class="inp" id="qw-${f.id}" name="${f.id}" type="${type}" placeholder="${f.placeholder || ""}" ${f.inputmode ? `inputmode="${f.inputmode}"` : ""} ${f.mask ? `data-mask="${f.mask}"` : ""} value="${v || ""}"></div>`;
  }

  contactStep() {
    return `<h3>Para onde enviamos a sua proposta?</h3>
      <p class="hint">Um especialista Ellü analisa seu pedido pessoalmente e te chama no WhatsApp.</p>
      <div class="fld"><label for="qw-nome">Nome completo</label><input class="inp" id="qw-nome" name="nome" autocomplete="name" placeholder="Seu nome"></div>
      <div class="fld-row">
        <div class="fld"><label for="qw-whats">WhatsApp</label><input class="inp" id="qw-whats" name="whats" type="tel" inputmode="tel" autocomplete="tel" placeholder="(61) 90000-0000" data-mask="phone"></div>
        <div class="fld"><label for="qw-email">E-mail</label><input class="inp" id="qw-email" name="email" type="email" autocomplete="email" placeholder="voce@email.com"></div>
      </div>
      <div class="fld" data-f="horario"><span class="lbl">Melhor horário para falarmos</span><div class="pills" data-type="chips" data-id="horario"><button type="button" data-v="Manhã">☀️ Manhã</button><button type="button" data-v="Tarde">🌤️ Tarde</button><button type="button" data-v="Noite">🌙 Noite</button></div></div>
      <label class="consent"><input type="checkbox" name="lgpd"> Concordo em ser contatado(a) pela Ellü sobre esta solicitação, conforme a política de privacidade.</label>`;
  }

  onClick(e) {
    const svc = e.target.closest("[data-svc]");
    if (svc) {
      this.root.querySelectorAll("[data-svc]").forEach((b) => b.classList.toggle("is-on", b === svc));
      if (this.service !== svc.dataset.svc) { this.data = { ...(this.o.preset || {}) }; }
      this.service = svc.dataset.svc;
      this.buildDetails(); this.head();
      setTimeout(() => this.next(), 260);
      return;
    }
    if (e.target.closest(".qchange")) {
      this.lockService = false; this.data = {};
      const keep = this.service; this.service = null;
      this.render();
      const b = this.root.querySelector(`[data-svc="${keep}"]`); if (b) b.classList.add("is-on");
      return;
    }
    const pill = e.target.closest(".pills button");
    if (pill) {
      const box = pill.parentElement, id = box.dataset.id;
      if (box.dataset.type === "multi") {
        pill.classList.toggle("is-on");
        this.data[id] = [...box.querySelectorAll(".is-on")].map((b) => b.dataset.v);
      } else {
        box.querySelectorAll("button").forEach((b) => b.classList.toggle("is-on", b === pill));
        this.data[id] = pill.dataset.v;
      }
      pill.closest(".fld").classList.remove("has-error");
      this.err("");
    }
  }

  onInput(e) {
    const t = e.target;
    if (t.dataset.range) {
      this.data[t.dataset.range] = +t.value;
      this.root.querySelector(`[data-money="${t.dataset.range}"]`).value = (+t.value).toLocaleString("pt-BR");
      this.paintRange(t);
    } else if (t.dataset.money) {
      const n = +t.value.replace(/\D/g, "") || 0;
      t.value = n ? n.toLocaleString("pt-BR") : "";
      const r = this.root.querySelector(`[data-range="${t.dataset.money}"]`);
      const cl = Math.min(+r.max, Math.max(+r.min, n));
      this.data[t.dataset.money] = cl; r.value = cl; this.paintRange(r);
    } else if (t.dataset.mask === "phone") t.value = maskPhone(t.value);
    else if (t.dataset.mask === "cep") t.value = t.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    if (t.closest(".fld")) t.closest(".fld").classList.remove("has-error");
    this.err("");
  }

  paintRange(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%"); }
  err(m) { this.root.querySelector(".qerr").textContent = m; }

  validate() {
    const step = this.steps[this.cur];
    if (step === "svc") { if (!this.service) { this.err("Escolha um serviço para continuar 🙂"); return false; } return true; }
    if (step === "det") {
      for (const f of this.fields) {
        if (f.type === "multi" || f.optional) continue;
        const fld = this.root.querySelector(`[data-s="det"] [data-f="${f.id}"]`);
        if (f.type === "text" || f.type === "date") this.data[f.id] = fld.querySelector("input").value.trim();
        const v = this.data[f.id];
        if (v == null || v === "") {
          fld.classList.add("has-error");
          fld.scrollIntoView({ behavior: "smooth", block: "center" });
          this.err(`Falta preencher: ${f.label.toLowerCase()}.`);
          return false;
        }
      }
      return true;
    }
    if (step === "dados") {
      const g = (n) => this.form.querySelector(`[name="${n}"]`);
      const nome = g("nome"), wa = g("whats"), em = g("email");
      [nome, wa, em].forEach((i) => i.closest(".fld").classList.remove("has-error"));
      const bad = (i, m) => { i.closest(".fld").classList.add("has-error"); this.err(m); i.focus(); return false; };
      if (nome.value.trim().length < 3) return bad(nome, "Como podemos te chamar?");
      if (wa.value.replace(/\D/g, "").length < 10) return bad(wa, "Confere o WhatsApp? Precisa ter DDD + número.");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) return bad(em, "Esse e-mail parece incompleto.");
      if (!g("lgpd").checked) { this.err("Para enviarmos a proposta, marque a autorização de contato."); return false; }
      Object.assign(this.data, { nome: nome.value.trim(), whats: wa.value.trim(), email: em.value.trim() });
      return true;
    }
    return true;
  }

  show(i, dir = 1) {
    const st = this.steps;
    const key = i === "done" ? "done" : st[i];
    this.root.querySelectorAll(".qw-step").forEach((el) => el.classList.remove("is-on", "back"));
    const el = this.root.querySelector(`[data-s="${key}"]`);
    el.classList.add("is-on"); if (dir < 0) el.classList.add("back");
    this.root.querySelectorAll(".qw-progress i").forEach((b, j) => b.classList.toggle("is-done", i === "done" || j <= i));
    this.root.querySelectorAll(".qw-progress--labels span").forEach((s, j) => s.classList.toggle("is-on", j === i));
    const done = i === "done";
    this.root.querySelector(".qw-nav").style.display = done ? "none" : "";
    this.root.querySelector(".qw-progress").style.display = done ? "none" : "";
    this.root.querySelector(".qw-progress--labels").style.display = done ? "none" : "";
    this.root.querySelector(".qback").hidden = done || i === 0;
    const nb = this.root.querySelector(".qnext");
    nb.innerHTML = (key === "dados" ? "Enviar solicitação " : "Continuar ") + ICON.arrow;
    nb.style.visibility = key === "svc" ? "hidden" : "";
    this.err("");
    if (this.o.onStep) this.o.onStep();
  }

  next() {
    if (!this.validate()) return;
    if (this.cur < this.steps.length - 1) { this.cur++; this.show(this.cur); this.scrollTop(); }
    else this.finish();
  }
  back() { if (this.cur > 0) { this.cur--; this.show(this.cur, -1); this.scrollTop(); } }
  scrollTop() {
    const card = this.root.closest(".modal__card");
    if (card) card.scrollTop = 0;
    else { const r = this.root.getBoundingClientRect(); if (r.top < 80) window.scrollBy({ top: r.top - 110, behavior: "smooth" }); }
  }

  finish() {
    const s = SERVICES[this.service];
    const first = this.data.nome.split(/\s+/)[0];
    const rows = [["Serviço", s.name]];
    (this.fields || []).forEach((f) => {
      let v = this.data[f.id];
      if (v == null || v === "" || (Array.isArray(v) && !v.length)) return;
      if (f.type === "money") v = BRL(v);
      if (Array.isArray(v)) v = v.join(", ");
      if (f.type === "date") v = v.split("-").reverse().join("/");
      rows.push([f.label.replace(/\?$/, ""), v]);
    });
    if (this.data.horario) rows.push(["Melhor horário", this.data.horario]);
    const el = this.root.querySelector('[data-s="done"]');
    el.innerHTML = `
      <div class="seal">${ICON.check}</div>
      <span class="kick">Solicitação recebida</span>
      <h3>${first}, sua ${s.group === "seguro" ? "cotação" : "proposta"} já está com a gente!</h3>
      <p class="hint">${s.group === "seguro" ? "Vamos cotar nas principais seguradoras e te chamar no WhatsApp com as melhores opções." : "Vamos analisar os grupos disponíveis e te chamar no WhatsApp com a proposta real."} Quer agilizar? Continue a conversa agora:</p>
      <dl class="qsummary">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <a class="btn btn--wa btn--lg btn--block qwa" target="_blank" rel="noopener" href="#">${ICON.wa} Continuar no WhatsApp</a>
      <p class="qprivacy" style="justify-content:center">A conversa já abre com os seus dados — nada de repetir tudo.</p>`;
    const text = [
      `Olá, Ellü! Sou ${this.data.nome}.`,
      `Acabei de solicitar pelo site: *${s.name}*${this.o.origem ? ` (${this.o.origem})` : ""}.`,
      "",
      ...rows.slice(1).map(([k, v]) => `• ${k}: ${v}`),
      `• E-mail: ${this.data.email}`,
      "",
      "Fico no aguardo da proposta!",
    ].join("\n");
    el.querySelector(".qwa").href = waLink(text);
    // Lead pronto para CRM — na versão final, enviar via fetch() para o endpoint/CRM
    const lead = { servico: this.service, ...this.data, origem: this.o.origem || "site", pagina: location.pathname, criadoEm: new Date().toISOString() };
    try { const all = JSON.parse(localStorage.getItem("ellu_cs_leads") || "[]"); all.push(lead); localStorage.setItem("ellu_cs_leads", JSON.stringify(all)); } catch (e) {}
    console.info("[Ellü] Novo lead:", lead);
    this.show("done");
    const r = el.querySelector(".seal").getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, undefined, 18);
  }
}

function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/* ---------- Modal de cotação ---------- */
const Cotacao = (function () {
  let modal, wiz;
  function build() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" role="dialog" aria-modal="true" aria-label="Solicitar cotação">
        <div class="modal__backdrop" data-close></div>
        <div class="modal__card"><button class="modal__close" data-close aria-label="Fechar">${ICON.close}</button><div class="modal__body"></div></div>
      </div>`);
    modal = document.querySelector(".modal");
    modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) close(); });
  }
  function open(opts = {}) {
    if (!modal) build();
    wiz = new QuoteWizard(modal.querySelector(".modal__body"), opts);
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
  }
  function close() { modal.classList.remove("is-open"); document.body.classList.remove("modal-open"); }
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-cotar]");
    if (!t) return;
    e.preventDefault();
    const v = t.dataset.cotar;
    open({ service: v || null, origem: t.dataset.origem || document.title.split("—")[0].trim() });
  });
  return { open, close };
})();

/* ---------- Inline: <div data-wizard="seguro-auto|consorcio|seguro|"> ---------- */
document.querySelectorAll("[data-wizard]").forEach((el) => {
  const q = new URLSearchParams(location.search);
  const v = el.dataset.wizard || q.get("s") || q.get("g") || "";
  const preset = {};
  if (q.get("valor")) preset.valor = +q.get("valor");
  if (q.get("prazo")) preset.prazo = `${q.get("prazo")} meses`;
  new QuoteWizard(el, { service: v, preset, origem: el.dataset.origem || "página de cotação", allowChange: el.dataset.lock === undefined });
});
