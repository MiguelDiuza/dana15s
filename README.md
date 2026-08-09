# Mis 15 · Dana Isabel Diuza Montaño

Invitación web de una sola página para los 15 años de Dana Isabel.
Sábado 22 de agosto de 2026, 3:00 p. m., Finca Santa Ana — Rozo, Valle del Cauca.

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
    terciopelo.jpg            Fondo de terciopelo azul
    mariposa.png              Mariposa dorada recortada
    peonia.png                Peonía azul recortada
    flyer-original.jpg        Vista previa al compartir (1080px)
    invitacion/
      invitacion.jpg          La invitación para enviar (2160×2880)
      invitacion-lluvia-      La misma, con la línea "Lluvia de sobres"
        sobres.jpg
    lugar/
      lugar-1..5.webp         Fotos del lugar, tamaño completo (visor)
      lugar-1..5-th.webp      Miniaturas de la galería (720px)
```

Las dos invitaciones no se usan en la página: son los archivos para mandar por
WhatsApp junto al enlace. Elige una u otra según toque pedir lluvia de sobres.

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

### Caché de imágenes

Las imágenes conservan su nombre cuando se reemplazan (`dana-retrato.jpg`
siempre se llama igual), así que **no** pueden servirse como `immutable`: el
navegador de quien ya vio la versión anterior se quedaría con ella durante un
año sin volver a preguntar. En [vercel.json](vercel.json) van con
`max-age=300, must-revalidate`, que las deja frescas cinco minutos y después
revalida contra el ETag — un 304 y nada de tráfico.

Además, las imágenes que cambiaron de magenta a azul se piden con `?v=azul`
al final de la URL. Eso hace falta porque la cabecera vieja sí decía
`immutable`: quien haya abierto la página antes tiene guardada la versión
magenta y su navegador no volverá a preguntar por ella. El sufijo cambia la
URL, así que la petición es nueva y nadie se queda con la imagen antigua.

**Si vuelves a reemplazar una imagen conservando su nombre, cambia también ese
sufijo** (`?v=azul` → `?v=3`, por ejemplo) en [index.html](index.html) y en
[styles.css](assets/css/styles.css). Si le pones un nombre nuevo al archivo, no
hace falta sufijo.

Para verlo al instante en tu propio navegador: recarga forzada
(**Ctrl + Shift + R**).

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

**Paleta**, tomada de la invitación: azul `#1D3F8F`, azul con luz `#3B72D9`,
azul noche `#0E1E4A`, oro `#C9A227`–`#F4DFA0`, marfil `#FAF7F2`.

**Tipografía**: *Playfair Display* para títulos y *Manrope* para lectura.
Playfair conserva el contraste didone del flyer pero con trazos finos más
sólidos, así que aguanta bien el «15» a tamaño grande.

**Regla de estilos**: nunca se parte un nombre propio en dos estilos.
«Dana Isabel Diuza Montaño» y «Finca Santa Ana» van en un solo estilo. La
itálica se reserva para acentuar frases —«De la piscina *al vals*»,
«Te espero *en Rozo*»— y para las horas del itinerario.

> Nota: la versión anterior usaba *Bodoni Moda*, que es variable con eje
> óptico `opsz`. En tamaños grandes el navegador subía `opsz` al corte
> *display*, los trazos finos desaparecían y el «1» quedaba como un
> rectángulo. Playfair es estática y no tiene ese problema, pero si algún día
> cambias a otra fuente variable con `opsz`, revisa los títulos grandes.

**El elemento firma** es el hilo del itinerario: un degradado que va del dorado
de la tarde al azul noche y se dibuja con el scroll, con cada parada
encendiéndose cuando el hilo la alcanza. El degradado se revela con
`clip-path`, no con `scaleY` — escalar comprimiría los colores y el hilo
mostraría la noche desde la tarde.

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
