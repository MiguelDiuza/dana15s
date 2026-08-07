# Mis 15 · Dana Isabel Diuza Montaño

Invitación web de una sola página para los 15 años de Dana Isabel.
Sábado 22 de agosto de 2026, 6:00 p. m., Finca Santa Ana — Rozo, Valle del Cauca.

HTML, CSS y JavaScript planos. Sin build, sin `npm install`, sin dependencias
externas en tiempo de ejecución: abre `index.html` y funciona.

---

## Cómo publicarlo

### Vercel (recomendado)

Es un sitio estático puro, así que Vercel lo despliega sin configuración.

```bash
git push
```

Luego en [vercel.com/new](https://vercel.com/new) importa el repositorio.
Cuando pregunte por el framework, elige **Other**; deja Build Command y Output
Directory vacíos. El [vercel.json](vercel.json) ya trae las cabeceras de caché
(las imágenes y GSAP se cachean un año, el CSS y el JS se revalidan siempre).

Alternativa desde la terminal:

```bash
npx vercel --prod
```

### GitHub Pages

**Settings → Pages → Source: Deploy from a branch → `main` / `root`**.
Queda en `https://<usuario>.github.io/dana15s/`.

### Cualquier otro hosting

Sube la carpeta completa. No hay build, ni rutas absolutas, ni configuración
de servidor.

---

## Estructura

```
index.html                    Todo el contenido, en orden de scroll
vercel.json                   Cabeceras de caché
assets/
  css/styles.css              Tokens, componentes y breakpoints
  js/main.js                  CONFIG + cuenta regresiva + galería + visor + animación
  js/vendor/                  GSAP y ScrollTrigger (locales, no CDN)
  img/
    dana-retrato.jpg          Retrato del hero (1100px)
    dana-retrato-sm.jpg       Versión móvil (640px)
    terciopelo.jpg            Fondo de terciopelo
    mariposa.png              Mariposa dorada recortada
    peonia.png                Peonía magenta recortada
    flyer-original.jpg        El flyer, usado como vista previa al compartir
    lugar/
      lugar-1..5.webp         Fotos del lugar, tamaño completo (visor)
      lugar-1..5-th.webp      Miniaturas de la galería (720px)
```

Secciones, en orden: **Hero → Detalles → Itinerario → Galería → Ubicación →
Código de vestimenta → Footer**, más la barra fija de *Confirmar asistencia*.

### La galería y el visor

Las miniaturas (313 KB en total) son lo único que carga con la página; las
fotos completas (935 KB) solo se piden al abrir el visor.

Para cambiar una foto, reemplaza el par `lugar-N.webp` + `lugar-N-th.webp`.
El título y el texto alternativo de cada una están en
[index.html](index.html), en `data-pie` y en el `alt` de la miniatura.

El visor usa `<dialog>` nativo. Se cierra con el botón ✕, tocando fuera de la
foto o con **Esc**; se navega con las flechas en pantalla, con las teclas ←→ o
deslizando el dedo. Al cerrarse devuelve el foco a la miniatura de origen.

### El mapa

El mapa arranca "dormido": el iframe no captura gestos hasta que se toca el
botón *"Toca para explorar el mapa"*. Sin esto, en móvil cualquier intento de
seguir bajando por la página se confundía con un intento de mover el mapa, y
viceversa — el reclamo original era justo ese. Un toque lo despierta y a
partir de ahí el pan/zoom nativo de Google Maps queda libre.

El botón de "Trazar mi ruta" no depende de este estado: siempre lleva directo
a la app de Google Maps, sea que el mapa embebido se haya tocado o no.

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
