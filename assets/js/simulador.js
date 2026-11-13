/* =========================================================
   Simulador de consórcio — objetivo, valor e prazo.
   <div data-sim="consorcio-imovel" data-compact data-fixed></div>
   Cálculo ilustrativo: (crédito × (1 + taxa adm + fundo de reserva)) ÷ prazo
   Comparação com financiamento pela Tabela Price, mesmo prazo.
   ========================================================= */

const FUNDO_RESERVA = 0.02;
const QUICK = {
  "consorcio-imovel": [200000, 350000, 500000, 800000],
  "consorcio-auto": [60000, 90000, 150000, 250000],
  "consorcio-moto": [15000, 25000, 50000, 90000],
  "consorcio-pesados": [200000, 400000, 700000, 1000000],
  "consorcio-servicos": [15000, 30000, 60000, 100000],
};
const short = (v) => (v >= 1e6 ? `R$ ${(v / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi` : `R$ ${Math.round(v / 1000)} mil`);

class Simulator {
  constructor(root) {
    this.root = root;
    this.compact = root.hasAttribute("data-compact");
    this.fixed = root.hasAttribute("data-fixed");
    const q = new URLSearchParams(location.search);
    const start = root.dataset.sim || q.get("obj") || "consorcio-imovel";
    this.obj = SERVICES[start] ? start : "consorcio-imovel";
    this.lance = "Sem lance";
    this.shown = { parcela: 0, credit: 0 };
    this.setObj(this.obj, true);
    if (q.get("valor") && !root.dataset.sim) this.credit = this.clamp(+q.get("valor"));
    this.render();
    this.update(true);
  }

  get cfg() { return SERVICES[this.obj].sim; }
  clamp(v) { const c = this.cfg; return Math.min(c.max, Math.max(c.min, Math.round(v / c.step) * c.step)); }

  setObj(id, silent) {
    this.obj = id;
    this.credit = this.cfg.def;
    this.term = this.cfg.defTerm;
    if (!silent) { this.renderControls(); this.update(); }
  }

  render() {
    const step = (n, t, small) => `<div class="sim__label"><span class="n">${n}</span>${t}${small ? `<small>${small}</small>` : ""}</div>`;
    let i = 1;
    this.root.className = `sim ${this.compact ? "sim--compact" : ""}`;
    this.root.innerHTML = `
      <div class="sim__panel">
        ${this.fixed ? "" : `<div class="sim__step">${step(i++, "Qual é o seu objetivo?", "toque para escolher")}
          <div class="objs" role="radiogroup" aria-label="Objetivo">${CONSORCIOS.map((id) => `<button type="button" class="obj" role="radio" data-obj="${id}"><span class="ic">${ico(SERVICES[id].icon)}</span>${SERVICES[id].short}</button>`).join("")}</div></div>`}
        <div class="sim__step">${step(i++, "Quanto você quer conquistar?", "arraste ou digite")}
          <div class="money"><small>R$</small><input type="text" inputmode="numeric" class="sim-money" aria-label="Valor do crédito"></div>
          <input type="range" class="range sim-range" aria-label="Valor do crédito">
          <div class="range-scale"><span class="sim-min"></span><span class="sim-max"></span></div>
          <div class="pills pills--quick sim-quick"></div>
        </div>
        <div class="sim__step">${step(i++, "Em quanto tempo?", "prazo do plano")}
          <div class="pills sim-terms"></div>
        </div>
        ${this.compact ? "" : `<div class="sim__step">${step(i++, "Tem algum valor para lance?", "opcional")}
          <div class="pills sim-lance">${["Sem lance", "Até 10%", "De 10% a 30%", "Mais de 30%", "Quero usar FGTS"].map((l) => `<button type="button" data-l="${l}" class="${l === this.lance ? "is-on" : ""}">${l}</button>`).join("")}</div>
          <p class="tiny muted" style="margin:12px 0 0">O lance é uma oferta para antecipar a contemplação. Vamos te mostrar a melhor estratégia na proposta.</p></div>`}
      </div>
      <aside class="sim__result" aria-live="polite">
        <div class="sr-top"><span class="sr-ico"></span><span><small>Sua simulação</small><b class="sr-name"></b></span></div>
        <div class="sr-parcela"><small>Parcela estimada</small><span class="val"><span class="sr-p"></span><em>/mês</em></span><small class="sr-sub"></small></div>
        <div class="sr-mini"><span>Crédito<b class="sr-c2"></b></span><span>Economia vs. financiamento<b class="sr-s2"></b></span></div>
        <div class="sr-grid">
          <div><small>Carta de crédito</small><b class="sr-c"></b></div>
          <div><small>Prazo</small><b class="sr-t"></b></div>
          <div><small>Taxa de adm. (ref.)</small><b class="sr-tx"></b></div>
          <div><small>Total no consórcio</small><b class="sr-tot"></b></div>
        </div>
        <div class="sr-compare">
          <h4>Consórcio x financiamento</h4>
          <div class="bar bar--c"><div class="bar__top"><span>Consórcio</span><b class="sr-bc"></b></div><div class="bar__track"><i></i></div></div>
          <div class="bar bar--f"><div class="bar__top"><span>Financiamento <span class="sr-fr"></span></span><b class="sr-bf"></b></div><div class="bar__track"><i></i></div></div>
        </div>
        <div class="sr-save">${ICON.noPercent}<span>Você deixa de pagar cerca de <b class="sr-save-v"></b> em juros</span></div>
        <button type="button" class="btn btn--orange btn--lg sr-cta">Quero uma proposta real ${ICON.arrow}</button>
        ${this.compact ? `<a class="btn btn--ghost sr-full" href="simulador.html">Abrir simulador completo</a>` : `<a class="btn btn--ghost sr-wa" target="_blank" rel="noopener" href="#">${ICON.wa} Tirar dúvidas no WhatsApp</a>`}
        <p class="sim-note">Simulação ilustrativa, com taxa de administração de referência e fundo de reserva de 2%. Valores reais variam conforme administradora, grupo e condições vigentes. Financiamento estimado pela Tabela Price, sem entrada.</p>
      </aside>`;

    this.$ = (s) => this.root.querySelector(s);
    this.root.addEventListener("click", (e) => {
      const o = e.target.closest("[data-obj]");
      if (o && o.dataset.obj !== this.obj) { this.setObj(o.dataset.obj); this.popIcon(); return; }
      const t = e.target.closest("[data-term]");
      if (t) { this.term = +t.dataset.term; this.renderTerms(); this.update(); return; }
      const qv = e.target.closest("[data-q]");
      if (qv) { this.credit = +qv.dataset.q; this.syncCredit(); this.update(); return; }
      const l = e.target.closest("[data-l]");
      if (l) { this.lance = l.dataset.l; this.root.querySelectorAll("[data-l]").forEach((b) => b.classList.toggle("is-on", b === l)); return; }
      if (e.target.closest(".sr-cta")) this.request();
    });
    this.$(".sim-range").addEventListener("input", (e) => { this.credit = +e.target.value; this.syncCredit(true); this.update(); });
    const money = this.$(".sim-money");
    money.addEventListener("input", () => {
      const n = +money.value.replace(/\D/g, "") || 0;
      money.value = n ? n.toLocaleString("pt-BR") : "";
      if (n >= this.cfg.min) { this.credit = Math.min(this.cfg.max, n); this.syncCredit(false, true); this.update(); }
    });
    money.addEventListener("blur", () => { this.credit = this.clamp(+money.value.replace(/\D/g, "") || this.cfg.min); this.syncCredit(); this.update(); });
    this.renderControls();
    this.popIcon();
  }

  renderControls() {
    const c = this.cfg;
    this.root.querySelectorAll("[data-obj]").forEach((b) => { const on = b.dataset.obj === this.obj; b.classList.toggle("is-on", on); b.setAttribute("aria-checked", on); });
    const r = this.$(".sim-range");
    r.min = c.min; r.max = c.max; r.step = c.step;
    this.$(".sim-min").textContent = BRL(c.min);
    this.$(".sim-max").textContent = BRL(c.max);
    this.$(".sim-quick").innerHTML = QUICK[this.obj].map((v) => `<button type="button" data-q="${v}">${short(v)}</button>`).join("");
    this.$(".sr-name").textContent = SERVICES[this.obj].name;
    this.$(".sr-ico").innerHTML = ico(SERVICES[this.obj].icon);
    this.syncCredit();
    this.renderTerms();
  }
  renderTerms() {
    this.$(".sim-terms").innerHTML = this.cfg.terms.map((t) => `<button type="button" data-term="${t}" class="${t === this.term ? "is-on" : ""}">${t} meses</button>`).join("");
  }
  syncCredit(fromRange, fromInput) {
    const r = this.$(".sim-range");
    if (!fromRange) r.value = this.credit;
    r.style.setProperty("--p", ((this.credit - this.cfg.min) / (this.cfg.max - this.cfg.min)) * 100 + "%");
    if (!fromInput) this.$(".sim-money").value = this.credit.toLocaleString("pt-BR");
    this.root.querySelectorAll("[data-q]").forEach((b) => b.classList.toggle("is-on", +b.dataset.q === this.credit));
  }
  popIcon() { const i = this.$(".sr-ico"); i.classList.remove("pop"); void i.offsetWidth; i.classList.add("pop"); }

  calc() {
    const c = this.cfg, n = this.term, P = this.credit;
    const total = P * (1 + c.taxa + FUNDO_RESERVA);
    const parcela = total / n;
    const i = c.fin;
    const finP = (P * i) / (1 - Math.pow(1 + i, -n));
    const finTotal = finP * n;
    return { total, parcela, finP, finTotal, save: Math.max(0, finTotal - total) };
  }

  update(first) {
    const r = this.calc();
    const from = this.shown.parcela;
    tween(first ? 0 : from, r.parcela, first ? 900 : 450, (v) => { this.$(".sr-p").textContent = BRL(v); });
    this.shown.parcela = r.parcela;
    this.$(".sr-sub").textContent = `por ${this.term} meses (${(this.term / 12).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} anos)`;
    this.$(".sr-c").textContent = BRL(this.credit);
    this.$(".sr-c2").textContent = BRL(this.credit);
    this.$(".sr-t").textContent = `${this.term} meses`;
    this.$(".sr-tx").textContent = `${Math.round(this.cfg.taxa * 100)}% no plano`;
    this.$(".sr-tot").textContent = BRL(r.total);
    this.$(".sr-bc").textContent = BRL(r.total);
    this.$(".sr-bf").textContent = BRL(r.finTotal);
    this.$(".sr-fr").textContent = `(${(this.cfg.fin * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}% a.m.)`;
    const max = Math.max(r.total, r.finTotal);
    requestAnimationFrame(() => {
      this.$(".bar--c i").style.width = (r.total / max) * 100 + "%";
      this.$(".bar--f i").style.width = (r.finTotal / max) * 100 + "%";
    });
    this.$(".sr-save-v").textContent = BRL(r.save);
    this.$(".sr-s2").textContent = BRL(r.save);
    const wa = this.$(".sr-wa");
    if (wa) wa.href = waLink(`Olá, Ellü! Fiz uma simulação no site: ${SERVICES[this.obj].name}, crédito de ${BRL(this.credit)} em ${this.term} meses (parcela estimada de ${BRL(r.parcela)}). Pode me ajudar?`);
    const box = this.$(".sr-parcela");
    if (!first) { box.classList.remove("bump"); void box.offsetWidth; box.classList.add("bump"); }
  }

  request() {
    const lanceMap = { "Sem lance": "Não, só as parcelas", "Até 10%": "Sim, até 10% do crédito", "De 10% a 30%": "Sim, de 10% a 30%", "Mais de 30%": "Sim, mais de 30%", "Quero usar FGTS": "Quero usar FGTS" };
    const preset = { valor: this.credit, prazo: `${this.term} meses` };
    const opts = (SERVICES[this.obj].fields.find((f) => f.id === "lance") || {}).options || [];
    if (!this.compact && opts.includes(lanceMap[this.lance])) preset.lance = lanceMap[this.lance];
    Cotacao.open({ service: this.obj, preset, origem: "simulador" });
  }
}

document.querySelectorAll("[data-sim]").forEach((el) => new Simulator(el));
