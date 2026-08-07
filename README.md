# Mis 15 · Dana Isabel Diuza Montaño

Invitación web de una sola página para los 15 años de Dana Isabel.
Sábado 22 de agosto de 2026, 6:00 p. m., Finca Santa Ana — Rozo, Valle del Cauca.

HTML, CSS y JavaScript planos. Sin build, sin `npm install`, sin dependencias
externas en tiempo de ejecución: abre `index.html` y funciona.

---

## Falta por llenar (2 cosas)

### 1. Número de WhatsApp para confirmar asistencia

En [assets/js/main.js](assets/js/main.js), primera línea de `CONFIG`:

```js
whatsapp: '',   // ← pon aquí el número, ej. '573001234567'
```

Formato internacional, sin `+` y sin espacios. Mientras esté vacío el botón
igual funciona: abre WhatsApp con el mensaje escrito y el invitado elige el
contacto a mano.

### 2. Las 3 fotos del lugar

No las descargué de la ficha de Google: son fotos de terceros y republicarlas
en un sitio propio es un tema de derechos que te corresponde decidir a ti.
La galería ya está armada y esperándolas.

Guarda tres fotos en `assets/img/` con estos nombres exactos:

```
assets/img/lugar-1.jpg   → "Zona social"
assets/img/lugar-2.jpg   → "La piscina"
assets/img/lugar-3.jpg   → "Para la noche"
```

Recomendado: vertical, ~900 × 1125 px, menos de 250 KB cada una.
Los títulos de cada tarjeta se cambian en [index.html](index.html), en los
`<figcaption>` de la sección galería.

Mientras no existan, las tarjetas muestran un degradado magenta con la leyenda
*"Foto pendiente"* — se ve intencional, no roto.

---

## Cómo publicarlo

### GitHub Pages

```bash
git add -A
git commit -m "Invitación 15 años Dana Isabel"
git push
```

Luego en el repo: **Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
Queda en `https://<usuario>.github.io/dana15s/`.

### Cualquier otro hosting

Sube la carpeta completa. No hay rutas absolutas ni configuración de servidor.

---

## Estructura

```
index.html                    Todo el contenido, en orden de scroll
assets/
  css/styles.css              Tokens, componentes y breakpoints
  js/main.js                  CONFIG + cuenta regresiva + galería + animación
  js/vendor/                  GSAP y ScrollTrigger (locales, no CDN)
  img/
    dana-retrato.jpg          Retrato del hero (1100px)
    dana-retrato-sm.jpg       Versión móvil (640px)
    terciopelo.jpg            Fondo de terciopelo
    mariposa.png              Mariposa dorada recortada
    peonia.png                Peonía magenta recortada
    flyer-original.jpg        El flyer, usado como vista previa al compartir
    lugar-1..3.jpg            ← pendientes
```

Secciones, en orden: **Hero → Detalles → Itinerario → Galería → Ubicación →
Código de vestimenta → Footer**, más la barra fija de *Confirmar asistencia*.

---

## Notas de diseño

**Paleta**, tomada del flyer: magenta `#A3114F`, fucsia `#D6337A`,
vino `#3F0A22`, oro `#C9A227`–`#F4DFA0`, marfil `#FBF6F1`.

**Tipografía**: *Playfair Display* para títulos y *Manrope* para lectura.
Playfair conserva el contraste didone del flyer pero con trazos finos más
sólidos, así que aguanta bien el «15» a tamaño grande.

**Regla de estilos**: nunca se parte un nombre propio en dos estilos.
«Dana Isabel Diuza Montaño» y «Finca Santa Ana» van en un solo estilo. La
itálica se reserva para acentuar frases —«Del mediodía *hasta el amanecer*»,
«Te espero *en Rozo*»— y para los momentos del itinerario.

> Nota: la versión anterior usaba *Bodoni Moda*, que es variable con eje
> óptico `opsz`. En tamaños grandes el navegador subía `opsz` al corte
> *display*, los trazos finos desaparecían y el «1» quedaba como un
> rectángulo. Playfair es estática y no tiene ese problema, pero si algún día
> cambias a otra fuente variable con `opsz`, revisa los títulos grandes.

**El elemento firma** es el hilo de oro del itinerario: un degradado que va del
dorado del mediodía al vino de la madrugada y se dibuja con el scroll, con cada
parada encendiéndose cuando el hilo la alcanza. El degradado se revela con
`clip-path`, no con `scaleY` — escalar comprimiría los colores y el hilo
mostraría la noche desde el mediodía.

**Animación**: GSAP + ScrollTrigger, servidos desde `assets/js/vendor/`.
Si el JavaScript no carga, la página se ve completa y legible igual.
`prefers-reduced-motion: reduce` desactiva todo el movimiento.

---

## Detalles menores

- **El mapa** apunta a `Finca Campestre Santa Ana, Callejón El Fuerte, La Torre,
  Rozo, Palmira` y el pin aparece correctamente. Si tienes las coordenadas
  exactas, reemplázalas en `CONFIG.lugar` ([main.js](assets/js/main.js)) y en el
  `src` del `<iframe>` ([index.html](index.html)) para afinarlo.
- **La cuenta regresiva** apunta a `2026-08-22T18:00:00-05:00`. Al llegar la
  fecha se reemplaza sola por "Hoy es el día".
- **Al compartir por WhatsApp** se muestra el flyer original como vista previa.
