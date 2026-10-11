(() => {
  "use strict";

  const CONFIG = {
    brand: "GUI.DEV",
    email: "",
    instagram: "",
    github: "",
    contactUrl: ""
  };

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#menu-principal");
  const navLinks = nav ? [...nav.querySelectorAll('a[href^="#"]')] : [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function closeMenu() {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
          link.classList.toggle("active", active);
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const form = document.querySelector("#contact-form");
  const errorBox = document.querySelector("#form-error");
  const resultBox = document.querySelector("#copy-result");
  const output = document.querySelector("#message-output");
  const copyButton = document.querySelector("#copy-message");
  const copyStatus = document.querySelector("#copy-status");

  function showError(message) {
    if (errorBox) errorBox.textContent = message;
  }

  function formValue(name) {
    const field = form?.elements.namedItem(name);
    return field && typeof field.value === "string" ? field.value.trim() : "";
  }

  function buildMessage() {
    const lines = [
      `Olá! Gostaria de conversar sobre um projeto com a ${CONFIG.brand}.`,
      "",
      `Nome: ${formValue("nome")}`,
      `Negócio: ${formValue("negocio") || "Não informado"}`,
      `Tipo de projeto: ${formValue("tipo")}`,
      `Faixa de orçamento: ${formValue("orcamento") || "A definir"}`,
      `Prazo desejado: ${formValue("prazo") || "A combinar"}`,
      `Canal preferido: ${formValue("canal")}`,
      "",
      "O que preciso:",
      formValue("descricao"),
      "",
      "Podemos conversar sobre o escopo e os próximos passos?"
    ];
    return lines.join("\n");
  }

  if (form && output && resultBox) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      showError("");
      if (!form.checkValidity()) {
        const invalid = form.querySelector(":invalid");
        showError(invalid?.validity.valueMissing
          ? "Preencha os campos obrigatórios destacados antes de continuar."
          : "Confira os campos: a descrição precisa ter pelo menos 10 caracteres.");
        invalid?.focus();
        invalid?.reportValidity();
        return;
      }
      const description = formValue("descricao");
      if (description.length < 10) {
        showError("Conte um pouco mais sobre o projeto (mínimo de 10 caracteres).");
        form.elements.namedItem("descricao")?.focus();
        return;
      }
      output.value = buildMessage();
      resultBox.hidden = false;
      copyStatus.textContent = "";
      resultBox.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    if (!output) throw new Error("Área de mensagem indisponível.");
    output.focus();
    output.select();
    const successful = document.execCommand("copy");
    if (!successful) throw new Error("O navegador não permitiu copiar automaticamente.");
  }

  if (copyButton && output && copyStatus) {
    copyButton.addEventListener("click", async () => {
      copyStatus.textContent = "";
      try {
        await copyText(output.value);
        copyStatus.textContent = "Mensagem copiada. Agora envie manualmente pelo canal escolhido.";
      } catch (error) {
        output.focus();
        output.select();
        copyStatus.textContent = "Não foi possível copiar automaticamente. O texto está selecionado: copie com Ctrl+C.";
      }
    });
  }

  // CONFIG guarda os canais editáveis. Nenhum link social é exibido enquanto estiver vazio.
  // Para adicionar canais no futuro, crie os links no HTML e só os revele após validar a URL.
})();