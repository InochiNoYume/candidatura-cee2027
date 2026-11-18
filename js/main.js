/* CEE 2027 · CEAT — interacciones globales */
(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const header = document.querySelector(".site-header");

  const closeMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
  };

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
    navigation.addEventListener("click", event => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!header?.contains(event.target)) closeMenu();
    });
  }

  // Indica de forma automática la página activa en todas las navegaciones.
  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".site-nav a[href]").forEach(link => {
    const targetPath = new URL(link.getAttribute("href"), window.location.href).pathname.replace(/\/$/, "/index.html");
    const current = targetPath === currentPath;
    link.classList.toggle("active", current);
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  // Las animaciones son progresivas y respetan la preferencia de movimiento reducido.
  const revealItems = document.querySelectorAll(
    ".hero-content,.intro-grid>div,.section-heading,.pillar-card,.listen-inner>*,.closing-grid>div," +
    ".page-hero .container,.team-card,.axis-card,.initiative,.status-item,.contact-card,.faq-item," +
    ".form-panel,.news-empty,.empty-gallery,.impact-item,.quick-access-card,.public-info-card,.work-method-card"
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealItems.forEach((element,index) => {
      element.classList.add("reveal");
      element.style.animationDelay = `${(index % 4) * 70}ms`;
    });
    const observer = new IntersectionObserver((entries,activeObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      });
    },{threshold:.1,rootMargin:"0px 0px -28px 0px"});
    revealItems.forEach(element => observer.observe(element));
  } else {
    revealItems.forEach(element => element.classList.add("is-visible"));
  }

  // Indicador de lectura y botón para volver arriba.
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden","true");
  progress.innerHTML = "<span></span>";
  document.body.appendChild(progress);
  const progressBar = progress.querySelector("span");

  const backToTop = document.createElement("button");
  backToTop.className = "back-to-top";
  backToTop.type = "button";
  backToTop.setAttribute("aria-label","Volver al inicio de la página");
  backToTop.innerHTML = "↑";
  document.body.appendChild(backToTop);

  const updateScrollUI = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const percent = height > 0 ? Math.min(100,Math.max(0,(window.scrollY / height) * 100)) : 0;
    progressBar.style.width = percent + "%";
    header?.classList.toggle("is-scrolled",window.scrollY > 12);
    backToTop.classList.toggle("visible",window.scrollY > 420);
  };
  window.addEventListener("scroll",updateScrollUI,{passive:true});
  window.addEventListener("resize",() => {
    if (window.innerWidth > 1040) closeMenu();
    updateScrollUI();
  },{passive:true});
  backToTop.addEventListener("click",() => {
    window.scrollTo({top:0,behavior:reduceMotion ? "auto" : "smooth"});
  });
  updateScrollUI();
})();
