/* CEE 2027 · CEAT — navegación, accesibilidad e interacciones globales */
(() => {
  const inPages = /\/pages\//.test(window.location.pathname);
  const pageBase = inPages ? "" : "pages/";
  const homeHref = inPages ? "../index.html" : "index.html";
  const nav = document.querySelector(".site-nav");
  const footerLinks = document.querySelector(".footer-links");
  const escapeAttr = value => String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;");
  const item = (file,label,description,icon) => ({
    href: pageBase + file, label, description, icon
  });
  const groups = [
    { id:"candidatura", label:"La candidatura", icon:"✦", description:"Conoce al equipo y su propuesta.", items:[
      item("lista.html","Nuestra lista","Integrantes, cargos y responsabilidades.","01"),
      item("proyecto.html","Proyecto y ejes","Las iniciativas y los cinco ejes de trabajo.","02"),
      item("agenda.html","Agenda y calendario","Fechas y actividades confirmadas.","03")
    ]},
    { id:"gestion", label:"Gestión y transparencia", icon:"▤", description:"Consulta acuerdos, avances y registros.", items:[
      item("transparencia.html","Transparencia","Seguimiento claro de la gestión.","04"),
      item("actas.html","Actas y acuerdos","Registros que puedan hacerse públicos.","05"),
      item("informes.html","Informes de gestión","Avances y resultados verificables.","06"),
      item("memoria.html","Memoria de actividades","Archivo cronológico de actividades.","07")
    ]},
    { id:"comunidad", label:"Comunidad estudiantil", icon:"◎", description:"Participación, identidad y vida escolar.", items:[
      item("comunidad-tp.html","Comunidad TP","Especialidades y experiencias técnico-profesionales.","08"),
      item("proyecto.html#eje-3","Deportes y vida saludable","Iniciativas del tercer eje.","09"),
      item("proyecto.html#eje-1","Medio ambiente","Sustentabilidad y cuidado del entorno.","10"),
      item("proyecto.html#eje-2","Convivencia e infraestructura","Cuidado de espacios y convivencia escolar.","11")
    ]},
    { id:"actualidad", label:"Actualidad y recursos", icon:"⌕", description:"Novedades, ayuda y canales de contacto.", items:[
      item("noticias.html","Noticias y avances","Comunicaciones y novedades.","12"),
      item("galeria.html","Galería","Registro visual autorizado.","13"),
      item("preguntas.html","Preguntas frecuentes","Respuestas a dudas habituales.","14"),
      item("buscar.html","Buscar en el sitio","Encuentra páginas y contenidos.","15"),
      item("contacto.html","Contacto","Canales institucionales de comunicación.","16"),
      item("privacidad.html","Privacidad y participación","Información sobre el uso de opiniones.","17")
    ]}
  ];
  const makeLink = (entry,extraClass="") =>
    '<a class="nav-item '+extraClass+'" href="'+escapeAttr(entry.href)+'">' +
      '<span class="nav-item-icon" aria-hidden="true">'+entry.icon+'</span>' +
      '<span class="nav-item-copy"><span class="nav-item-title">'+entry.label+'</span>' +
      '<span class="nav-item-description">'+entry.description+'</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>';
  if (nav) {
    nav.innerHTML =
      '<a class="nav-home" href="'+homeHref+'"><span class="nav-home-icon" aria-hidden="true">⌂</span>Inicio</a>' +
      groups.map(group =>
        '<details class="nav-dropdown nav-group-'+group.id+'">' +
          '<summary><span class="nav-summary-icon" aria-hidden="true">'+group.icon+'</span><span>'+group.label+'</span><span class="nav-chevron" aria-hidden="true">⌄</span></summary>' +
          '<div class="nav-dropdown-panel"><div class="nav-panel-heading"><strong>'+group.label+'</strong><span>'+group.description+'</span></div>' +
          '<div class="nav-panel-items">'+group.items.map(entry=>makeLink(entry)).join("")+'</div></div></details>'
      ).join("") +
      '<a class="nav-search" href="'+pageBase+'buscar.html"><span aria-hidden="true">⌕</span><span class="sr-only">Buscar</span></a>' +
      '<a class="nav-cta" href="'+pageBase+'escucha.html"><span aria-hidden="true">♡</span> CEAT Te Escucha</a>';
  }
  if (footerLinks) {
    footerLinks.innerHTML = groups.map(group =>
      '<section class="footer-group"><h2>'+group.label+'</h2>'+group.items.map(entry =>
        '<a href="'+escapeAttr(entry.href)+'">'+entry.label+'</a>'
      ).join("")+'</section>'
    ).join("") +
    '<section class="footer-group"><h2>Participación</h2><a href="'+pageBase+'escucha.html">CEAT Te Escucha</a></section>';
  }

  const menuButton = document.querySelector(".menu-toggle");
  const header = document.querySelector(".site-header");
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Abrir menú");
    menuButton.classList.remove("is-open");
  };
  if (menuButton && nav) {
    menuButton.addEventListener("click",() => {
      const opened = nav.classList.toggle("open");
      menuButton.setAttribute("aria-expanded",String(opened));
      menuButton.setAttribute("aria-label",opened ? "Cerrar menú" : "Abrir menú");
      menuButton.classList.toggle("is-open",opened);
    });
    nav.addEventListener("click",event => {
      const anchor = event.target.closest("a");
      if (anchor) closeMenu();
    });
    nav.querySelectorAll(".nav-dropdown").forEach(current => {
      current.addEventListener("toggle",() => {
        if (current.open) nav.querySelectorAll(".nav-dropdown").forEach(other => {
          if (other !== current) other.removeAttribute("open");
        });
      });
    });
    document.addEventListener("keydown",event => {
      if (event.key === "Escape") {
        closeMenu();
        nav.querySelectorAll(".nav-dropdown[open]").forEach(group=>group.removeAttribute("open"));
        menuButton.focus();
      }
    });
    document.addEventListener("click",event => {
      if (header && !header.contains(event.target)) {
        closeMenu();
        nav.querySelectorAll(".nav-dropdown[open]").forEach(group=>group.removeAttribute("open"));
      }
    });
  }

  const currentPath = window.location.pathname.replace(/\/$/,"/index.html");
  nav?.querySelectorAll("a[href]").forEach(anchor => {
    const target = new URL(anchor.getAttribute("href"),window.location.href);
    const targetPath = target.pathname.replace(/\/$/,"/index.html");
    const active = targetPath === currentPath;
    anchor.classList.toggle("active",active);
    if (active && !target.hash) anchor.setAttribute("aria-current","page");
    else anchor.removeAttribute("aria-current");
    if (active) anchor.closest("details.nav-dropdown")?.setAttribute("open","");
  });

  const revealItems = document.querySelectorAll(
    ".hero-content,.intro-grid>div,.section-heading,.pillar-card,.listen-inner>*,.closing-grid>div," +
    ".page-hero .container,.team-card,.axis-card,.initiative,.status-item,.contact-card,.faq-item," +
    ".form-panel,.news-empty,.empty-gallery,.impact-item,.quick-access-card,.public-info-card,.work-method-card"
  );
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealItems.forEach((element,index) => {
      element.classList.add("reveal");
      element.style.animationDelay = (index % 4) * 70 + "ms";
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
  } else revealItems.forEach(element=>element.classList.add("is-visible"));


  // Filtros rápidos de agenda, galería, noticias y transparencia.
  document.querySelectorAll("[data-filter-group]").forEach(group => {
    const name = group.getAttribute("data-filter-group");
    const buttons = Array.from(group.querySelectorAll("[data-filter]"));
    const items = Array.from(document.querySelectorAll('[data-filter-item="'+name+'"]'));
    const empty = document.querySelector('[data-filter-empty="'+name+'"]');
    const result = group.querySelector(".filter-result");
    const update = value => {
      buttons.forEach(button => {
        const active = button.getAttribute("data-filter") === value;
        button.classList.toggle("is-active",active);
        button.setAttribute("aria-pressed",String(active));
      });
      let visible = 0;
      items.forEach(item => {
        const categories = (item.getAttribute("data-category") || "").split(/\\s+/);
        const show = name === "news" ? value === "all" : value === "all" || categories.includes(value);
        item.hidden = !show;
        if (show) visible++;
      });
      if (empty) {
        if (name === "news") {
          empty.hidden = value === "all";
          empty.textContent = value === "all"
            ? "Todavía no hay publicaciones. Los filtros estarán disponibles para mostrar cada tipo de contenido cuando se publiquen novedades confirmadas."
            : "Todavía no hay publicaciones de este tipo. Aquí aparecerán cuando exista información confirmada.";
        } else empty.hidden = visible > 0;
      }
      if (result) result.textContent = visible + (name === "gallery" ? " categorías" : name === "agenda" ? " fechas" : " estados");
    };
    buttons.forEach(button => button.addEventListener("click",() => update(button.getAttribute("data-filter"))));
    update("all");
  });

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
    if (window.innerWidth > 1180) closeMenu();
    updateScrollUI();
  },{passive:true});
  backToTop.addEventListener("click",() => window.scrollTo({top:0,behavior:reduceMotion ? "auto" : "smooth"}));
  updateScrollUI();
})();
