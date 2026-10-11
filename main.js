document.documentElement.classList.remove("no-js");
const navItems = [
  ["Início","index.html"],["Serviços","servicos.html"],["Nossa história","historia.html"],
  ["Equipe","equipe.html"],["Galeria","galeria.html"],["Contato","contato.html"]
];
const currentPage = location.pathname.split("/").pop() || "index.html";
const conceptNotice = document.createElement("aside");
conceptNotice.className = "concept-notice";
conceptNotice.setAttribute("role", "note");
conceptNotice.textContent = "PROJETO CONCEITUAL PARA PORTFÓLIO · dados, endereço, equipe, preços e agendamento são fictícios";
document.body.prepend(conceptNotice);
const headerHost = document.querySelector("[data-header]");
if (headerHost) {
  headerHost.innerHTML = `<header class="site-header"><div class="container nav-wrap">
    <a class="brand" href="index.html" aria-label="Brasa & Navalha - início"><span class="brand-mark">B&amp;N</span><span class="brand-copy"><strong>BRASA &amp; NAVALHA</strong><small>BARBER CLUB</small></span></a>
    <button class="menu-toggle" aria-label="Abrir menu" aria-expanded="false">☰</button>
    <nav class="nav-links" aria-label="Navegação principal">${navItems.map(([label,url])=>`<a href="${url}" class="${currentPage===url?"active":""}">${label}</a>`).join("")}<a href="agendamento.html" class="nav-cta ${currentPage==="agendamento.html"?"active":""}">Agendar ↗</a></nav>
  </div></header>`;
}
const footerHost = document.querySelector("[data-footer]");
if (footerHost) {
  footerHost.innerHTML = `<footer class="site-footer"><div class="container"><div class="footer-main">
    <div class="footer-brand"><a class="brand" href="index.html"><span class="brand-mark">B&amp;N</span><span class="brand-copy"><strong>BRASA &amp; NAVALHA</strong><small>BARBER CLUB</small></span></a><p>Tradição no ofício. Excelência em cada detalhe. Um espaço para cuidar do seu estilo.</p></div>
    <div class="footer-col"><h4>EXPLORE</h4><a href="servicos.html">Serviços</a><a href="historia.html">Nossa história</a><a href="equipe.html">Nossa equipe</a><a href="galeria.html">Galeria</a></div>
    <div class="footer-col"><h4>ATENDIMENTO</h4><a href="agendamento.html">Agendar horário</a><a href="contato.html">Contato e localização</a><a href="contato.html#faq">Perguntas frequentes</a></div>
    <div class="footer-col"><h4>HORÁRIOS</h4><p>Ter–Sáb · 09h–20h</p><p>Dom · 09h–14h</p><p>Segunda · Fechado</p><a href="contato.html">Contato ↗</a></div>
  </div><div class="footer-bottom"><span>© <span data-year></span> Brasa &amp; Navalha Barber Club. Projeto fictício.</span><span>Feito com cuidado e personalidade.</span></div></div></footer>`;
}
document.querySelectorAll("[data-year]").forEach(el=>el.textContent=new Date().getFullYear());
// Não há canal comercial real configurado: nenhum telefone ou link fictício é exibido.
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if(menuButton && nav){
  menuButton.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
    menuButton.textContent=open?"×":"☰";
    document.body.classList.toggle("menu-open",open);
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.textContent="☰";document.body.classList.remove("menu-open");
  }));
}
const header = document.querySelector(".site-header");
const onScroll=()=>{if(header)header.classList.toggle("scrolled",window.scrollY>24)};
window.addEventListener("scroll",onScroll,{passive:true});onScroll();
const revealEls=document.querySelectorAll(".reveal");
if("IntersectionObserver" in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}
  }),{threshold:.12});
  revealEls.forEach(el=>observer.observe(el));
}else revealEls.forEach(el=>el.classList.add("is-visible"));
document.querySelectorAll("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll("[data-filter]").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
  const filter=btn.dataset.filter;
  document.querySelectorAll(".gallery-item").forEach(item=>item.classList.toggle("hidden",filter!=="all"&&item.dataset.category!==filter));
}));
