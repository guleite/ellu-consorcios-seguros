/* =========================================================
   Planos de Saúde — interações da página saude.html
   - atalhos do hero para "pessoal" / "empresa"
   - "Monte seu plano": medidor de perfil de preço
   - linha do tempo das carências (anima ao aparecer)
   - glossário com cartões que viram
   ========================================================= */

/* ---------- Atalhos do hero: abrem a aba certa ---------- */
document.querySelectorAll("[data-path]").forEach((a) => a.addEventListener("click", () => {
  const tab = document.querySelectorAll("#caminhos [data-tab]")[+a.dataset.path];
  if (tab) tab.click();
}));

/* ---------- Monte seu plano ---------- */
(function planBuilder() {
  const box = document.querySelector("[data-pb]");
  if (!box) return;
  const st = { para: "pessoal", abr: 0, acom: 0, cop: 0, ree: 0 };
  const W = { abr: 1, acom: 1, cop: 1, ree: 1.5 };
  const MAX = 4.5;
  const PROFILES = [
    [0.5, "Essencial", "Atendimento na sua região, enfermaria e coparticipação: a mensalidade mais leve para quem usa o plano de vez em quando."],
    [2, "Equilíbrio", "Um meio-termo bem escolhido: você melhora o que mais importa e mantém a mensalidade sob controle."],
    [3.5, "Completo", "Mais conforto e liberdade de uso, com mensalidade acima da média. Ideal para quem usa o plano com frequência."],
    [9, "Premium", "Cobertura ampla, apartamento e reembolso para escolher médicos fora da rede. O topo de linha do mercado."],
  ];
  const WHY = {
    abr: ["Atendimento no DF e entorno deixa o plano mais barato.", "Cobertura no Brasil todo encarece, mas atende em viagens e mudanças."],
    acom: ["Enfermaria é a opção mais econômica para internações.", "Apartamento dá privacidade e acompanhante, com mensalidade maior."],
    cop: ["Com coparticipação você paga um pouco ao usar e economiza todo mês.", "Sem coparticipação a mensalidade é maior, mas o uso fica livre."],
    ree: ["Ficar na rede credenciada não pesa no preço.", "Reembolso é o item que mais encarece: vale para quem tem médico de confiança fora da rede."],
  };
  const needle = box.querySelector(".gauge__needle");
  const fill = box.querySelector(".gauge__fill");
  const name = box.querySelector(".pb__name");
  const desc = box.querySelector(".pb__desc");
  const why = box.querySelector(".pb__why");
  let last = "";

  const render = () => {
    const score = ["abr", "acom", "cop", "ree"].reduce((t, k) => t + st[k] * W[k], 0);
    const k = score / MAX;
    needle.style.transform = `rotate(${-90 + 180 * k}deg)`;
    fill.style.strokeDasharray = `${Math.max(2, k * 100)} 100`;
    const p = PROFILES.find(([lim]) => score <= lim);
    if (p[1] !== last) { name.textContent = p[1]; name.classList.remove("bump"); void name.offsetWidth; name.classList.add("bump"); last = p[1]; }
    desc.textContent = p[2];
    why.innerHTML = ["abr", "acom", "cop", "ree"].map((x) => `<li class="${st[x] ? "up" : "down"}"><i>${st[x] ? "▲" : "▼"}</i>${WHY[x][st[x]]}</li>`).join("")
      + (st.para === "empresa" ? `<li class="tip"><i>★</i>Empresas com 30 vidas ou mais ficam livres de carência para quem entra no prazo.</li>` : "");
  };

  box.addEventListener("click", (e) => {
    const b = e.target.closest(".seg button");
    if (!b) return;
    const row = b.closest("[data-k]"), key = row.dataset.k;
    row.querySelectorAll("button").forEach((x) => x.classList.toggle("is-on", x === b));
    st[key] = key === "para" ? b.dataset.v : +b.dataset.v;
    render();
  });

  box.querySelector(".pb__cta").addEventListener("click", () => {
    const emp = st.para === "empresa";
    const preset = {
      abrangencia: st.abr ? "No Brasil todo" : "No DF e entorno",
    };
    if (emp) {
      preset.extras = st.cop ? [] : ["Coparticipação"];
    } else {
      preset.acomodacao = st.acom ? "Apartamento" : "Enfermaria";
      preset.copart = st.cop ? "Sem coparticipação" : "Com coparticipação";
      preset.extras = st.ree ? ["Reembolso de consultas"] : [];
    }
    Cotacao.open({ service: emp ? "saude-empresarial" : "saude-pessoal", preset, origem: `guia saúde - perfil ${last}` });
  });

  render();
})();

/* ---------- Linha do tempo das carências ---------- */
(function carencias() {
  const el = document.querySelector("[data-ctime]");
  if (!el) return;
  new IntersectionObserver(([en], io) => {
    if (!en.isIntersecting) return;
    el.classList.add("is-on");
    io.disconnect();
  }, { threshold: 0.35 }).observe(el);
})();

/* ---------- Glossário: cartões que viram ---------- */
document.querySelectorAll(".flip").forEach((f) => f.addEventListener("click", () => f.classList.toggle("is-flipped")));
