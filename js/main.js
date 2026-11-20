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
      item("proyecto.html#eje-2","Convivencia e infraestructura","Cuidado de espacios y convivencia escolar.","11"),
      item("proyecto.html#eje-5","Eje complementario: bienestar","Apoyo, oportunidades y participación estudiantil.","18")
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
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label","Abrir menú");
    menuButton.classList.remove("is-open");
  };
  if (menuButton && nav) {
    menuButton.addEventListener("click",() => {
      const opened = nav.classList.toggle("open");
      document.body.classList.toggle("menu-open",opened);
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


  // Filtros y paginación de iniciativas de Transparencia.
  document.querySelectorAll("[data-filter-group]").forEach(group => {
    const name = group.getAttribute("data-filter-group");
    const buttons = Array.from(group.querySelectorAll("[data-filter]"));
    const items = Array.from(document.querySelectorAll('[data-filter-item="' + name + '"]'));
    const empty = document.querySelector('[data-filter-empty="' + name + '"]');
    const result = group.querySelector(".filter-result");
    const isCommitments = name === "commitments";
    const pageSize = 5;
    let currentPage = 1;
    let activeFilter = "all";
    const search = isCommitments ? document.querySelector("#commitment-search") : null;
    const list = isCommitments ? document.querySelector('[data-filter-list="commitments"]') : null;
    const pagination = isCommitments ? document.createElement("nav") : null;
    if (pagination && list) {
      pagination.className = "commitment-pagination";
      pagination.setAttribute("aria-label", "Páginas de iniciativas");
      list.insertAdjacentElement("afterend", pagination);
    }

    const update = (value, resetPage = true) => {
      activeFilter = value;
      if (resetPage) currentPage = 1;
      buttons.forEach(button => {
        const active = button.getAttribute("data-filter") === value;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      const term = search ? search.value.trim().toLocaleLowerCase("es") : "";
      const matching = items.filter(element => {
        const categories = (element.getAttribute("data-category") || "").split(/\\s+/);
        const matchesFilter = value === "all" || categories.includes(value);
        const matchesSearch = !term || element.textContent.toLocaleLowerCase("es").includes(term);
        return matchesFilter && matchesSearch;
      });

      const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
      currentPage = Math.min(currentPage, pageCount);
      const first = (currentPage - 1) * pageSize;
      const visible = new Set(isCommitments ? matching.slice(first, first + pageSize) : matching);
      items.forEach(element => { element.hidden = !visible.has(element); });

      if (empty) empty.hidden = matching.length !== 0;
      if (result) result.textContent = matching.length + (name === "commitments" ? " iniciativas" : name === "gallery" ? " categorías" : name === "agenda" ? " fechas" : " estados");

      if (pagination) {
        pagination.replaceChildren();
        pagination.hidden = pageCount <= 1;
        if (pageCount > 1) {
          const previous = document.createElement("button");
          previous.type = "button";
          previous.textContent = "← Anterior";
          previous.disabled = currentPage === 1;
          previous.addEventListener("click", () => { currentPage--; update(activeFilter, false); });
          const status = document.createElement("span");
          status.className = "pagination-status";
          status.setAttribute("aria-live", "polite");
          status.textContent = "Página " + currentPage + " de " + pageCount;
          const next = document.createElement("button");
          next.type = "button";
          next.textContent = "Siguiente →";
          next.disabled = currentPage === pageCount;
          next.addEventListener("click", () => { currentPage++; update(activeFilter, false); });
          pagination.append(previous, status, next);
        }
      }
    };

    buttons.forEach(button => button.addEventListener("click", () => update(button.getAttribute("data-filter"))));
    update("all");
    if (search) search.addEventListener("input", () => update(activeFilter));
  });

  // Calendario mensual basado exclusivamente en las fechas confirmadas de la agenda.
  const calendar = document.querySelector("#agenda-calendar");
  if (calendar) {
    const events = Array.from(document.querySelectorAll(".agenda-event[data-calendar-start]")).map(card => ({start:card.dataset.calendarStart,end:card.dataset.calendarEnd,title:card.querySelector("h3")?.textContent.trim()||"Actividad",detail:card.querySelector(".agenda-event-body p")?.textContent.trim()||""}));
    let month=new Date(2026,10,1);
    const title=document.querySelector("#agenda-calendar-title"),detail=document.querySelector("#agenda-calendar-detail");
    const pad=n=>String(n).padStart(2,"0"),key=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
    const render=()=>{
      calendar.querySelectorAll(".agenda-calendar-day,.agenda-calendar-blank").forEach(n=>n.remove());
      const y=month.getFullYear(),m=month.getMonth(),first=(new Date(y,m,1).getDay()+6)%7,days=new Date(y,m+1,0).getDate();
      title.textContent=new Intl.DateTimeFormat("es-CL",{month:"long",year:"numeric"}).format(month);
      for(let i=0;i<first;i++){const blank=document.createElement("span");blank.className="agenda-calendar-blank";blank.setAttribute("aria-hidden","true");calendar.appendChild(blank);}
      for(let day=1;day<=days;day++){
        const date=key(new Date(y,m,day)),matches=events.filter(ev=>date>=ev.start&&date<=ev.end),button=document.createElement("button");
        button.type="button";button.className="agenda-calendar-day";button.textContent=String(day);
        button.setAttribute("aria-label",day+" de "+title.textContent+(matches.length?": "+matches.map(ev=>ev.title).join(", "):""));
        if(matches.length)button.classList.add("has-event");
        button.addEventListener("click",()=>{
          detail.replaceChildren();const heading=document.createElement("strong");
          heading.textContent=new Intl.DateTimeFormat("es-CL",{dateStyle:"full"}).format(new Date(y,m,day));detail.appendChild(heading);
          if(!matches.length){detail.appendChild(document.createTextNode(" No hay actividades confirmadas para esta fecha."));return;}
          matches.forEach(ev=>{const p=document.createElement("p");p.textContent=ev.title+" — "+ev.detail;detail.appendChild(p);});
        });
        calendar.appendChild(button);
      }
    };
    document.querySelector("[data-calendar-prev]")?.addEventListener("click",()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);render();detail.textContent="Selecciona una fecha marcada para consultar su actividad.";});
    document.querySelector("[data-calendar-next]")?.addEventListener("click",()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);render();detail.textContent="Selecciona una fecha marcada para consultar su actividad.";});
    render();
  }

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
    if (window.innerWidth > 1240) closeMenu();
    updateScrollUI();
  },{passive:true});
  backToTop.addEventListener("click",() => window.scrollTo({top:0,behavior:reduceMotion ? "auto" : "smooth"}));
  updateScrollUI();

  // Partículas ambientales ligeras en la portada (sin librerías externas).
  const hero = document.querySelector(".hero");
  if (hero && !reduceMotion && "requestAnimationFrame" in window) {
    const canvas = document.createElement("canvas");
    canvas.className = "hero-particles";
    canvas.setAttribute("aria-hidden","true");
    hero.prepend(canvas);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let width=0,height=0,frame=0,particles=[];
      const makeParticles=()=>Array.from({length:Math.min(58,Math.max(24,Math.round(width/24)))},()=>({
        x:Math.random()*width,y:Math.random()*height,
        r:.7+Math.random()*1.8,vx:(Math.random()-.5)*.16,vy:-.12-Math.random()*.28,
        a:.12+Math.random()*.34,phase:Math.random()*Math.PI*2
      }));
      const resize=()=>{
        const rect=hero.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.5);
        width=rect.width;height=rect.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
        canvas.style.width=width+"px";canvas.style.height=height+"px";ctx.setTransform(dpr,0,0,dpr,0,0);
        particles=makeParticles();
      };
      let animationRunning=false;
      const draw=()=>{
        if(document.hidden){frame=0;animationRunning=false;return}
        ctx.clearRect(0,0,width,height);
        particles.forEach(p=>{
          p.x+=p.vx;p.y+=p.vy;p.phase+=.008;
          if(p.y<-8){p.y=height+8;p.x=Math.random()*width}
          if(p.x<-8)p.x=width+8;if(p.x>width+8)p.x=-8;
          ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
          ctx.fillStyle="rgba(255,220,220,"+(p.a*(.72+.28*Math.sin(p.phase)))+")";ctx.fill();
        });
        frame=requestAnimationFrame(draw);
      };
      const startAnimation=()=>{
        if(animationRunning||document.hidden)return;
        animationRunning=true;
        frame=requestAnimationFrame(draw);
      };
      const stopAnimation=()=>{
        if(frame)cancelAnimationFrame(frame);
        frame=0;
        animationRunning=false;
      };
      resize();startAnimation();
      window.addEventListener("resize",resize,{passive:true});
      document.addEventListener("visibilitychange",()=>{
        if(document.hidden)stopAnimation();
        else startAnimation();
      });
      window.addEventListener("pagehide",stopAnimation);
      window.addEventListener("pageshow",startAnimation);
    } else canvas.remove();
  }

  // Asistente informativo: no guarda conversaciones ni solicita datos personales.
  const assistantLauncher = document.createElement("button");
  assistantLauncher.className = "cee-assistant-launcher";
  assistantLauncher.type = "button";
  assistantLauncher.setAttribute("aria-expanded","false");
  assistantLauncher.setAttribute("aria-controls","cee-assistant-panel");
  assistantLauncher.setAttribute("aria-label","Abrir Asistente CEE");
  assistantLauncher.innerHTML = '<span class="cee-assistant-launcher-icon" aria-hidden="true"><svg viewBox="0 0 32 32" focusable="false"><path d="M6.5 13.2 6 5.8l7 4.1a12 12 0 0 1 6 0l7-4.1-.5 7.4a10.5 10.5 0 1 1-19 0Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 17h.1M20 17h.1M13 21c1.8 1.6 4.2 1.6 6 0M16 18.5l-1 1h2l-1-1Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span>Asistente CEE</span>';
  const assistantPanel = document.createElement("section");
  assistantPanel.className = "cee-assistant-panel";
  assistantPanel.id = "cee-assistant-panel";
  assistantPanel.hidden = true;
  assistantPanel.setAttribute("aria-labelledby","cee-assistant-title");
  assistantPanel.innerHTML =
    '<div class="cee-assistant-head"><div><p class="cee-assistant-kicker">CEE 2027 · CEAT</p><h2 id="cee-assistant-title">Asistente CEE</h2><p class="cee-assistant-status"><span aria-hidden="true"></span> Ayuda e información del sitio</p></div>' +
    '<button class="cee-assistant-close" type="button" aria-label="Cerrar asistente">×</button></div>' +
    '<p class="cee-assistant-intro">Resuelvo dudas sobre esta web y su propuesta usando información publicada aquí.</p>' +
    '<div class="cee-assistant-messages" role="log" aria-live="polite" aria-relevant="additions text"><p class="cee-assistant-message assistant">¡Hola! Puedes preguntarme por los ejes, la agenda, la lista o las secciones del sitio.</p></div>' +
    '<form class="cee-assistant-form"><label class="sr-only" for="cee-assistant-input">Escribe tu pregunta</label>' +
    '<textarea id="cee-assistant-input" maxlength="500" rows="2" placeholder="Escribe tu pregunta…" required></textarea>' +
    '<div class="cee-assistant-form-foot"><span>Máximo 500 caracteres</span><button type="submit">Enviar <span aria-hidden="true">↑</span></button></div></form>' +
    '<p class="cee-assistant-privacy">No compartas datos personales. Las preguntas se envían a Cloudflare para generar la respuesta y no se guardan en este sitio.</p>';
  document.body.append(assistantLauncher,assistantPanel);
  const assistantMessages = assistantPanel.querySelector(".cee-assistant-messages");
  const assistantInput = assistantPanel.querySelector("#cee-assistant-input");
  const assistantForm = assistantPanel.querySelector("form");

    const appendAssistantInline = (parent, text) => {
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    parts.forEach(part => {
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
        const strong = document.createElement("strong");
        strong.textContent = part.slice(2,-2);
        parent.appendChild(strong);
      } else if (part) parent.appendChild(document.createTextNode(part));
    });
  };
  const renderAssistantText = (message, text, isUser) => {
    const lines = String(text).replace(/\r/g,"").split("\n");
    let list = null;
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) { list = null; return; }
      const item = trimmed.match(/^(?:[-*•]|\d+[.)])\s+(.+)$/);
      if (item && !isUser) {
        if (!list) { list = document.createElement("ul"); message.appendChild(list); }
        const li = document.createElement("li");
        appendAssistantInline(li,item[1]);
        list.appendChild(li);
      } else {
        list = null;
        const paragraph = document.createElement("p");
        appendAssistantInline(paragraph,trimmed);
        message.appendChild(paragraph);
      }
    });
  };
  const addAssistantMessage = (text,isUser=false) => {
    const message = document.createElement("div");
    message.className = "cee-assistant-message " + (isUser ? "user" : "assistant");
    renderAssistantText(message,text,isUser);
    assistantMessages.appendChild(message);
    assistantMessages.scrollTop = assistantMessages.scrollHeight;
    return message;
  };
  const setAssistantOpen = opened => {
    assistantPanel.hidden = !opened;
    assistantLauncher.setAttribute("aria-expanded",String(opened));
    assistantLauncher.setAttribute("aria-label",opened ? "Cerrar Asistente CEE" : "Abrir Asistente CEE");
    if (opened) assistantInput.focus();
    else assistantLauncher.focus();
  };
  assistantLauncher.addEventListener("click",() => setAssistantOpen(assistantPanel.hidden));
  assistantPanel.querySelector(".cee-assistant-close").addEventListener("click",() => setAssistantOpen(false));
  document.addEventListener("keydown",event => {
    if (event.key === "Escape" && !assistantPanel.hidden) setAssistantOpen(false);
  });
  // Enter envía; Shift+Enter conserva la posibilidad de escribir una nueva línea.
  assistantInput.addEventListener("keydown",event => {
    if (event.key !== "Enter" || event.shiftKey || event.isComposing || assistantInput.disabled) return;
    event.preventDefault();
    if (!assistantInput.value.trim()) return;
    if (typeof assistantForm.requestSubmit === "function") assistantForm.requestSubmit();
    else assistantForm.dispatchEvent(new Event("submit",{bubbles:true,cancelable:true}));
  });
  assistantForm.addEventListener("submit",async event => {
    event.preventDefault();
    const question = assistantInput.value.trim();
    if (!question || question.length > 500) return;
    addAssistantMessage(question,true);
    assistantInput.value = "";
    assistantInput.disabled = true;
    const sendButton = assistantForm.querySelector('button[type="submit"]');
    sendButton.disabled = true;
    const pending = addAssistantMessage("Estoy revisando la información del sitio…");
    const pendingTimer = window.setTimeout(() => {
      if (pending.isConnected) pending.textContent = "La consulta está tardando un poco más. Estoy intentando completarla…";
    }, 8000);
    try {
      const response = await fetch("/api/asistente",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({question}),
        // Cubre el timeout de Gemini y un reintento acotado.
        signal: AbortSignal.timeout(55000)
      });
      const payload = await response.json().catch(() => ({}));
      window.clearTimeout(pendingTimer);
      pending.remove();
      if (!response.ok) {
        const safeError = typeof payload.error === "string" ? payload.error : "";
        const fallbackErrors = {
          400: "La solicitud no pudo procesarse. Revisa tu pregunta e inténtalo otra vez.",
          401: "La autenticación del asistente no fue aceptada. El equipo administrador debe revisar su configuración.",
          403: "Acceso denegado. Abre el asistente desde la web oficial del CEE.",
          404: "No se encontró el modelo de Gemini configurado. El equipo administrador debe revisar su identificador.",
          408: "La solicitud tardó demasiado. Espera un momento y vuelve a intentarlo.",
          413: "La solicitud es demasiado grande. Reduce el contenido e inténtalo nuevamente.",
          415: "El formato de la solicitud no es compatible. Recarga la página e inténtalo otra vez.",
          429: "Se alcanzó temporalmente el límite de consultas. Espera antes de volver a intentarlo.",
          500: "El servicio encontró un error interno. Inténtalo más tarde.",
          502: "No se pudo completar la comunicación con Gemini. Inténtalo nuevamente más tarde.",
          503: "Gemini está temporalmente no disponible. No es un problema con tu pregunta; espera un momento y vuelve a intentarlo.",
          504: "Gemini tardó demasiado en responder. Vuelve a intentarlo más tarde."
        };
        addAssistantMessage(safeError || fallbackErrors[response.status] || ("No se pudo completar la solicitud (HTTP " + response.status + "). Inténtalo más tarde."));
      } else {
        addAssistantMessage(typeof payload.answer === "string" && payload.answer
          ? payload.answer
          : "No encontré una respuesta clara en la información publicada. Revisa las secciones oficiales del sitio.");
      }
    } catch (error) {
      window.clearTimeout(pendingTimer);
      pending.remove();
      const timedOut = error?.name === "TimeoutError" || error?.name === "AbortError";
      addAssistantMessage(timedOut
        ? "El asistente está tardando más de lo esperado. Tu mensaje no se perdió; espera un momento y vuelve a intentarlo."
        : "No se pudo conectar con el asistente. Comprueba tu conexión e inténtalo nuevamente.");
    } finally {
      assistantInput.disabled = false;
      sendButton.disabled = false;
      assistantInput.focus();
    }
  });

  // Rastro de partículas para mouse, lápiz y toques.
  // El canvas solo anima mientras hay partículas y se detiene al ocultar la página.
  if (!reduceMotion && "requestAnimationFrame" in window) {
    const trailCanvas = document.createElement("canvas");
    trailCanvas.className = "cee-pointer-trail";
    trailCanvas.setAttribute("aria-hidden","true");
    document.body.appendChild(trailCanvas);
    const trailContext = trailCanvas.getContext("2d");
    if (trailContext) {
      let trailWidth=0,trailHeight=0,trailFrame=0,trailParticles=[];
      let lastPointerAt=0;
      const resizeTrail=()=>{
        const dpr=Math.min(window.devicePixelRatio||1,1.25);
        trailWidth=window.innerWidth;trailHeight=window.innerHeight;
        trailCanvas.width=Math.round(trailWidth*dpr);
        trailCanvas.height=Math.round(trailHeight*dpr);
        trailContext.setTransform(dpr,0,0,dpr,0,0);
      };
      const drawTrail=()=>{
        trailFrame=0;
        trailContext.clearRect(0,0,trailWidth,trailHeight);
        trailParticles=trailParticles.filter(p=>p.life>.045);
        trailParticles.forEach(p=>{
          p.x+=p.vx;p.y+=p.vy;p.vx*=.982;p.vy*=.982;p.life-=.035;
          trailContext.beginPath();
          trailContext.arc(p.x,p.y,p.r*p.life,0,Math.PI*2);
          trailContext.fillStyle="rgba(128,21,21,"+(.34*p.life)+")";
          trailContext.fill();
        });
        if(trailParticles.length) scheduleTrail();
      };
      const scheduleTrail=()=>{
        if (!trailFrame && !document.hidden) trailFrame=requestAnimationFrame(drawTrail);
      };
      const addTrail=(x,y,count=3)=>{
        for(let i=0;i<count;i++){
          if(trailParticles.length>=54)trailParticles.shift();
          const angle=Math.random()*Math.PI*2;
          const speed=.25+Math.random()*.85;
          trailParticles.push({
            x:x+(Math.random()-.5)*8,y:y+(Math.random()-.5)*8,
            vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
            life:.85+Math.random()*.15,r:.9+Math.random()*1.55
          });
        }
        scheduleTrail();
      };
      document.addEventListener("pointermove",event=>{
        if(event.pointerType!=="mouse" && event.pointerType!=="pen" && event.pointerType!=="touch") return;
        const now=performance.now();
        if(now-lastPointerAt>=16){
          addTrail(event.clientX,event.clientY,event.pointerType==="touch"?4:2);
          lastPointerAt=now;
        }
      },{passive:true});
      document.addEventListener("pointerdown",event=>{
        if(event.pointerType==="touch" || event.pointerType==="pen" || event.pointerType==="mouse"){
          addTrail(event.clientX,event.clientY,event.pointerType==="touch"?10:5);
        }
      },{passive:true});
      resizeTrail();
      window.addEventListener("resize",resizeTrail,{passive:true});
      document.addEventListener("visibilitychange",()=>{
        if(document.hidden){cancelAnimationFrame(trailFrame);trailFrame=0;}
        else if(trailParticles.length) scheduleTrail();
      });
      window.addEventListener("pagehide",()=>{
        cancelAnimationFrame(trailFrame);trailFrame=0;
      },{once:true});
    } else trailCanvas.remove();
  }

})();
