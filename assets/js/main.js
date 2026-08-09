/* ═══════════════════════════════════════════════════════════
   Mis 15 · Dana Isabel Diuza Montaño
   Animación (GSAP + ScrollTrigger), cuenta regresiva, galería
   y enlaces de confirmación.
   ═══════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────
   CONFIGURACIÓN — lo único que necesitas tocar
   ───────────────────────────────────────────────────────── */
const CONFIG = {
  /* Número de WhatsApp para confirmar asistencia.
     Formato internacional, sin +, sin espacios. Ej. Colombia: "573001234567".
     Mientras esté vacío, el botón abre WhatsApp para que el invitado
     elija el contacto a mano. */
  whatsapp: '573113852488',

  mensaje: '¡Hola! Confirmo mi asistencia a los 15 de Dana Isabel el sábado 22 de agosto. 🎉',

  /* 22 de agosto de 2026, 3:00 p.m., hora de Colombia (UTC-5) */
  fechaEvento: '2026-08-22T15:00:00-05:00',

  /* Destino del botón "Trazar mi ruta". Si tienes el enlace exacto de la
     ficha en Google Maps, reemplaza este texto por sus coordenadas
     ("3.5123,-76.3456"): el pin queda perfecto. */
  lugar: 'Finca Campestre Santa Ana, Callejón El Fuerte, La Torre, Rozo, Palmira, Valle del Cauca'
};

/* ─────────────────────────────────────────────────────────
   Utilidades
   ───────────────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hayGsap = typeof window.gsap !== 'undefined';

/* ─────────────────────────────────────────────────────────
   1 · Enlaces de acción
   ───────────────────────────────────────────────────────── */
function montarEnlaces() {
  const rsvp = $('#btnRsvp');
  if (rsvp) {
    const texto = encodeURIComponent(CONFIG.mensaje);
    rsvp.href = CONFIG.whatsapp
      ? `https://wa.me/${CONFIG.whatsapp}?text=${texto}`
      : `https://wa.me/?text=${texto}`;

    if (!CONFIG.whatsapp) {
      console.warn(
        '[invitación] Falta el número de WhatsApp. Ponlo en CONFIG.whatsapp ' +
        'dentro de assets/js/main.js — ej. "573001234567".'
      );
    }
  }

  const ruta = $('#btnRuta');
  if (ruta) {
    ruta.href = 'https://www.google.com/maps/dir/?api=1&destination=' +
      encodeURIComponent(CONFIG.lugar);
  }
}

/* ─────────────────────────────────────────────────────────
   2 · El mapa: dormido hasta que se toca
       El iframe de Google Maps captura cualquier gesto de arrastre o
       pellizco. Dentro de una página con scroll eso hace que mover el
       mapa y deslizar la página se peleen por el mismo toque. Por eso
       arranca con pointer-events:none y un botón encima; un solo toque
       lo despierta y a partir de ahí el pan/zoom nativo de Google Maps
       queda libre de esa interferencia.
   ───────────────────────────────────────────────────────── */
function montarMapa() {
  const mapa = $('#mapa');
  const activar = $('#mapaActivar');
  if (!mapa || !activar) return;

  activar.addEventListener('click', () => {
    mapa.classList.add('is-activo');
    $('iframe', mapa)?.focus();
  }, { once: true });
}

/* ─────────────────────────────────────────────────────────
   3 · Cuenta regresiva
   ───────────────────────────────────────────────────────── */
function montarCuentaRegresiva() {
  const caja = $('#countdown');
  const rotulo = $('#countdownLabel');
  if (!caja) return;

  const destino = new Date(CONFIG.fechaEvento).getTime();
  if (Number.isNaN(destino)) return;

  const campos = {
    dias:     $('[data-unit="dias"]', caja),
    horas:    $('[data-unit="horas"]', caja),
    minutos:  $('[data-unit="minutos"]', caja),
    segundos: $('[data-unit="segundos"]', caja)
  };

  const dosDigitos = (n) => String(n).padStart(2, '0');

  function pintar() {
    const restante = destino - Date.now();

    if (restante <= 0) {
      caja.remove();
      if (rotulo) rotulo.textContent = 'Hoy es el día';
      clearInterval(reloj);
      return;
    }

    const s = Math.floor(restante / 1000);
    campos.dias.textContent     = Math.floor(s / 86400);
    campos.horas.textContent    = dosDigitos(Math.floor(s / 3600) % 24);
    campos.minutos.textContent  = dosDigitos(Math.floor(s / 60) % 60);
    campos.segundos.textContent = dosDigitos(s % 60);
  }

  pintar();
  const reloj = setInterval(pintar, 1000);
}

/* ─────────────────────────────────────────────────────────
   4 · Galería: puntos, sincronía con el scroll y fotos ausentes
   ───────────────────────────────────────────────────────── */
function montarGaleria() {
  const pista = $('#galleryTrack');
  const puntos = $('#galleryDots');
  if (!pista || !puntos) return;

  const items = $$('.gallery__item', pista);
  if (!items.length) return;

  /* Si una foto llegara a faltar, la tarjeta se ve intencional
     en vez de mostrar el ícono de imagen rota. */
  $$('img', pista).forEach((img) => {
    const marcar = () => img.closest('.gallery__abrir')?.classList.add('is-missing');
    img.addEventListener('error', marcar);
    if (img.complete && img.naturalWidth === 0) marcar();
  });

  items.forEach((item, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Ver foto ${i + 1} de ${items.length}`);
    b.addEventListener('click', () => {
      pista.scrollTo({
        left: item.offsetLeft - (pista.clientWidth - item.clientWidth) / 2,
        behavior: sinMovimiento ? 'auto' : 'smooth'
      });
    });
    puntos.appendChild(b);
  });

  const botones = $$('button', puntos);

  function marcarActivo() {
    const tope = pista.scrollWidth - pista.clientWidth;
    let activo;

    /* en los extremos la primera y la última tarjeta nunca llegan a
       centrarse, así que se marcan por posición de scroll */
    if (tope <= 1 || pista.scrollLeft <= 2) {
      activo = 0;
    } else if (pista.scrollLeft >= tope - 2) {
      activo = items.length - 1;
    } else {
      const centro = pista.scrollLeft + pista.clientWidth / 2;
      let menor = Infinity;
      activo = 0;
      items.forEach((item, i) => {
        const d = Math.abs(item.offsetLeft + item.clientWidth / 2 - centro);
        if (d < menor) { menor = d; activo = i; }
      });
    }

    botones.forEach((b, i) =>
      b.setAttribute('aria-current', i === activo ? 'true' : 'false')
    );
  }

  let esperando = false;
  pista.addEventListener('scroll', () => {
    if (esperando) return;
    esperando = true;
    requestAnimationFrame(() => { marcarActivo(); esperando = false; });
  }, { passive: true });

  marcarActivo();
}

/* ─────────────────────────────────────────────────────────
   5 · Visor de fotos
       Se cierra con el botón, tocando fuera de la imagen,
       con Esc, y se navega con flechas o deslizando.
   ───────────────────────────────────────────────────────── */
function montarVisor() {
  const visor = $('#visor');
  const img = $('#visorImg');
  const pie = $('#visorPie');
  const contador = $('#visorContador');
  const caja = $('#visorCaja');
  const botones = $$('.gallery__abrir');

  if (!visor || !img || !botones.length || typeof visor.showModal !== 'function') return;

  const fotos = botones.map((b) => ({
    full: b.dataset.full,
    pie: b.dataset.pie,
    alt: $('img', b)?.alt || b.dataset.pie
  }));

  let actual = 0;
  let origen = null;

  function pintar(i) {
    actual = (i + fotos.length) % fotos.length;
    const foto = fotos[actual];
    img.src = foto.full;
    img.alt = foto.alt;
    pie.textContent = foto.pie;
    contador.textContent = `${actual + 1} / ${fotos.length}`;
  }

  function abrir(i, disparador) {
    origen = disparador || null;
    pintar(i);
    visor.showModal();
    document.documentElement.classList.add('visor-abierto');
  }

  function cerrar() {
    if (visor.open) visor.close();
  }

  visor.addEventListener('close', () => {
    document.documentElement.classList.remove('visor-abierto');
    /* devuelve el foco a la miniatura desde la que se abrió */
    origen?.focus({ preventScroll: true });
    origen = null;
  });

  botones.forEach((b, i) => {
    b.addEventListener('click', () => abrir(i, b));
  });

  $('#visorCerrar')?.addEventListener('click', cerrar);
  $('#visorPrev')?.addEventListener('click', () => pintar(actual - 1));
  $('#visorNext')?.addEventListener('click', () => pintar(actual + 1));

  /* clic fuera de la imagen: el destino es el propio <dialog> */
  visor.addEventListener('click', (e) => {
    if (e.target === visor) cerrar();
  });

  visor.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); pintar(actual - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); pintar(actual + 1); }
  });

  /* deslizar horizontalmente para cambiar de foto */
  let inicioX = null;
  caja?.addEventListener('touchstart', (e) => {
    inicioX = e.changedTouches[0].clientX;
  }, { passive: true });

  caja?.addEventListener('touchend', (e) => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 45) pintar(actual + (dx < 0 ? 1 : -1));
    inicioX = null;
  }, { passive: true });
}

/* ─────────────────────────────────────────────────────────
   6 · El hilo del itinerario arranca y termina en el centro
       exacto del primer y del último nodo
   ───────────────────────────────────────────────────────── */
function ajustarHilo() {
  const timeline = $('#timeline');
  const hilo = $('.timeline__thread', timeline || document);
  const nodos = $$('.stop__node', timeline || document);
  if (!timeline || !hilo || nodos.length < 2) return;

  const base = timeline.getBoundingClientRect();
  const primero = nodos[0].getBoundingClientRect();
  const ultimo = nodos[nodos.length - 1].getBoundingClientRect();

  const arriba = primero.top + primero.height / 2 - base.top;
  const abajo = ultimo.top + ultimo.height / 2 - base.top;

  hilo.style.top = `${arriba}px`;
  hilo.style.height = `${abajo - arriba}px`;
}

/* ─────────────────────────────────────────────────────────
   7 · Animación
   ───────────────────────────────────────────────────────── */
function montarAnimacion() {
  /* Sin GSAP o con movimiento reducido: todo se muestra tal cual
     y la barra de confirmación aparece de una vez. */
  if (!hayGsap || sinMovimiento) {
    $('#rsvpBar')?.classList.add('is-visible');
    $('#threadFill')?.style.setProperty('clip-path', 'inset(0 0 0% 0)');
    $$('.stop').forEach((s) => s.classList.add('is-lit'));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* — Entrada del hero: una sola secuencia orquestada — */
  const piezas = $$('[data-anim]').sort(
    (a, b) => Number(a.dataset.anim) - Number(b.dataset.anim)
  );

  gsap.set(piezas, { opacity: 0, y: 26 });
  gsap.set('.hero__num', { scale: .94 });
  gsap.set('.hero__mariposa', { opacity: 0, scale: .8, rotate: '-=12' });

  const entrada = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: .15
  });

  entrada
    .to(piezas, { opacity: 1, y: 0, duration: 1, stagger: .11 })
    .to('.hero__num', { scale: 1, duration: 1.4, ease: 'expo.out' }, '<0.05')
    .to('.hero__mariposa', {
      opacity: (i) => (i === 0 ? .85 : .6),
      scale: 1,
      rotate: (i) => (i === 0 ? 14 : -22),
      duration: 1.6,
      stagger: .18,
      ease: 'power2.out'
    }, '<0.2');

  /* — Aparición suave por sección — */
  $$('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: .95, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      }
    );
  });

  /* — Parallax ligero del fondo del hero — */
  $$('[data-parallax]').forEach((el) => {
    gsap.to(el, {
      yPercent: Number(el.dataset.parallax) * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  /* — La firma: el hilo de oro se dibuja con el scroll — */
  const hilo = $('#threadFill');
  if (hilo) {
    gsap.fromTo(hilo,
      { clipPath: 'inset(0 0 100% 0)' },
      {
        clipPath: 'inset(0 0 0% 0)', ease: 'none',
        scrollTrigger: {
          trigger: '#timeline',
          start: 'top 70%',
          end: 'bottom 65%',
          scrub: .6
        }
      }
    );
  }

  /* — Cada parada se enciende cuando el hilo la alcanza — */
  $$('.stop').forEach((stop) => {
    ScrollTrigger.create({
      trigger: stop,
      start: 'top 74%',
      onEnter:     () => stop.classList.add('is-lit'),
      onLeaveBack: () => stop.classList.remove('is-lit')
    });
  });

  /* — La barra de confirmación entra al salir del hero — */
  const barra = $('#rsvpBar');
  if (barra) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'bottom 90%',
      onEnter:     () => barra.classList.add('is-visible'),
      onLeaveBack: () => barra.classList.remove('is-visible')
    });
  }

  /* Las fuentes cambian las alturas: recalcula al terminar de cargarlas. */
  const remedir = () => { ajustarHilo(); ScrollTrigger.refresh(); };
  if (document.fonts?.ready) document.fonts.ready.then(remedir);
  window.addEventListener('load', remedir);
}

/* ─────────────────────────────────────────────────────────
   Arranque
   ───────────────────────────────────────────────────────── */
montarEnlaces();
montarMapa();
montarCuentaRegresiva();
montarGaleria();
montarVisor();
ajustarHilo();
montarAnimacion();

let remedirTimer;
window.addEventListener('resize', () => {
  clearTimeout(remedirTimer);
  remedirTimer = setTimeout(() => {
    ajustarHilo();
    if (hayGsap && !sinMovimiento) ScrollTrigger.refresh();
  }, 150);
});
