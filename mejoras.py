#!/usr/bin/env python3
"""
mejoras.py · Aplica las mejoras que pidió el profesor al portfolio.

Uso (desde la carpeta raíz del repositorio, donde está index.html):

    pip install pillow fonttools brotli
    python mejoras.py            # aplica los cambios
    python mejoras.py --simular  # solo enseña qué haría, sin tocar nada

Qué hace (cada paso es independiente y se puede repetir sin problema):
  1. Open Graph + twitter:card en las 6 páginas (usa el <title> y la
     description que ya tiene cada página).
  2. Crea image/gabriel-400.webp si falta (arregla el 404 del srcset).
  3. Recomprime los image/fondo-*.webp que pesen más de 300 KB.
  4. Convierte las fuentes Monocraft a woff2 (subconjunto latino) y cambia
     el @font-face para usarlas. Avisa de las fuentes de fonts/ que sobran.
  5. Divide style.css en css/*.css (mismo orden, mismo resultado visual),
     quita el bloque duplicado del carrusel y actualiza los <link> de
     todas las páginas.

Los originales se guardan en _backup_mejoras/ (no lo subas a GitHub).
"""
import re
import shutil
import sys
from pathlib import Path

SIMULAR = "--simular" in sys.argv
RAIZ = Path(".")
BACKUP = RAIZ / "_backup_mejoras"
BASE_URL = "https://gabi37smx.github.io/mi-web/"
OG_IMAGEN = BASE_URL + "image/gabriel.webp"
PAGINAS = ["index", "contacto", "proyectos", "juego", "noticias", "presentacion"]


def aviso(txt):
    print(("[simulación] " if SIMULAR else "") + txt)


def leer(ruta):
    """Devuelve (texto con \\n, salto de línea original)."""
    crudo = ruta.read_bytes().decode("utf-8")
    nl = "\r\n" if "\r\n" in crudo else "\n"
    return crudo.replace("\r\n", "\n"), nl


def escribir(ruta, texto, nl):
    if SIMULAR:
        return
    ruta.write_bytes(texto.replace("\n", nl).encode("utf-8"))


def copia_seguridad(ruta):
    if SIMULAR or not ruta.exists():
        return
    BACKUP.mkdir(exist_ok=True)
    destino = BACKUP / ruta.name
    if not destino.exists():
        shutil.copy2(ruta, destino)


def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;")


# --------------------------------------------------------------------------
# 1 · Open Graph en todas las páginas
# --------------------------------------------------------------------------
def paso_og():
    print("\n== 1 · Open Graph ==")
    for nombre in PAGINAS:
        ruta = RAIZ / f"{nombre}.html"
        if not ruta.exists():
            print(f"  ! {ruta} no existe, lo salto")
            continue
        html, nl = leer(ruta)
        if 'property="og:title"' in html:
            print(f"  = {ruta.name}: ya tiene Open Graph")
            continue

        t = re.search(r"<title>(.*?)</title>", html, re.S)
        d = re.search(r'<meta name="description" content="(.*?)"\s*/?>', html, re.S)
        titulo = t.group(1).strip() if t else "Gabriel Vidal Badia"
        desc = d.group(1).strip() if d else "Portfolio de Gabriel Vidal Badia."
        c = re.search(r'<link rel="canonical" href="(.*?)"', html)
        url = c.group(1) if c else BASE_URL + ("" if nombre == "index" else f"{nombre}.html")

        bloque = (
            '  <meta property="og:type" content="website" />\n'
            f'  <meta property="og:site_name" content="Gabriel Vidal Badia" />\n'
            f'  <meta property="og:title" content="{titulo}" />\n'
            f'  <meta property="og:description" content="{desc}" />\n'
            f'  <meta property="og:url" content="{url}" />\n'
            '  <meta property="og:locale" content="es_ES" />\n'
            f'  <meta property="og:image" content="{OG_IMAGEN}" />\n'
            '  <meta property="og:image:alt" content="Gabriel Vidal Badia, desarrollador en formación" />\n'
            '  <meta name="twitter:card" content="summary_large_image" />\n'
            f'  <meta name="twitter:title" content="{titulo}" />\n'
            f'  <meta name="twitter:description" content="{desc}" />\n'
            f'  <meta name="twitter:image" content="{OG_IMAGEN}" />\n'
        )
        # Se coloca justo antes del primer <link rel="preconnect"> (o del </head>)
        m = re.search(r'\n[ \t]*<link rel="preconnect"', html) or re.search(r"\n[ \t]*</head>", html)
        if not m:
            print(f"  ! {ruta.name}: no encuentro dónde insertarlo")
            continue
        html = html[: m.start() + 1] + bloque + "\n" + html[m.start() + 1 :]
        copia_seguridad(ruta)
        escribir(ruta, html, nl)
        aviso(f"  + {ruta.name}: Open Graph añadido")


# --------------------------------------------------------------------------
# 2 y 3 · Imágenes
# --------------------------------------------------------------------------
def paso_imagenes():
    print("\n== 2 y 3 · Imágenes ==")
    try:
        from PIL import Image
    except ImportError:
        print("  ! Falta Pillow: pip install pillow")
        return

    # 404: gabriel-400.webp
    grande = RAIZ / "image" / "gabriel.webp"
    pequena = RAIZ / "image" / "gabriel-400.webp"
    if pequena.exists():
        print("  = gabriel-400.webp ya existe")
    elif not grande.exists():
        print("  ! No encuentro image/gabriel.webp; sin él no puedo crear gabriel-400.webp.")
        print("    Alternativa: quita el srcset de la <img> de index.html.")
    else:
        aviso("  + creo image/gabriel-400.webp (400 px de ancho)")
        if not SIMULAR:
            im = Image.open(grande)
            alto = round(im.height * 400 / im.width)
            im.resize((400, alto), Image.LANCZOS).save(pequena, "WEBP", quality=80, method=6)

    # Fondos pesados del juego
    for f in sorted((RAIZ / "image").glob("fondo-*.webp")):
        kb = f.stat().st_size / 1024
        if kb <= 300:
            continue
        aviso(f"  + recomprimo {f.name} ({kb:.0f} KB)")
        if SIMULAR:
            continue
        copia_seguridad(f)
        im = Image.open(BACKUP / f.name if (BACKUP / f.name).exists() else f)
        if im.width > 1920:
            im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
        tmp = f.with_suffix(".tmp.webp")
        im.save(tmp, "WEBP", quality=70, method=6)
        if tmp.stat().st_size < f.stat().st_size:
            tmp.replace(f)
            print(f"      {kb:.0f} KB -> {f.stat().st_size / 1024:.0f} KB")
        else:
            tmp.unlink()
            print("      ya estaba bien comprimida, la dejo igual")


# --------------------------------------------------------------------------
# 4 · Fuentes
# --------------------------------------------------------------------------
UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0100-017F,U+2010-2027,U+2030-203A,"
    "U+20AC,U+2190-2193,U+2212,U+2022,U+00B7"
)


def paso_fuentes():
    print("\n== 4 · Fuentes Monocraft ==")
    fuentes = RAIZ / "fonts"
    if not fuentes.exists():
        print("  ! No hay carpeta fonts/")
        return
    try:
        from fontTools import subset
    except ImportError:
        print("  ! Faltan fonttools y brotli: pip install fonttools brotli")
        return

    for ttf in ("Monocraft.ttf", "Monocraft-Bold.ttf"):
        origen = fuentes / ttf
        destino = fuentes / ttf.replace(".ttf", ".woff2")
        if destino.exists():
            print(f"  = {destino.name} ya existe")
            continue
        if not origen.exists():
            print(f"  ! Falta {origen}")
            continue
        aviso(f"  + {ttf} -> {destino.name}")
        if SIMULAR:
            continue
        opciones = subset.Options()
        opciones.flavor = "woff2"
        opciones.layout_features = ["*"]
        opciones.notdef_outline = True
        fuente = subset.load_font(str(origen), opciones)
        sub = subset.Subsetter(opciones)
        sub.populate(unicodes=subset.parse_unicodes(UNICODES))
        sub.subset(fuente)
        subset.save_font(fuente, str(destino), opciones)
        print(f"      {origen.stat().st_size / 1024:.0f} KB -> {destino.stat().st_size / 1024:.0f} KB")

    # Ficheros de fonts/ que ningún CSS usa
    css_todo = ""
    for c in [RAIZ / "style.css", *(RAIZ / "css").glob("*.css"), RAIZ / "juego-escalada.css"]:
        if c.exists():
            css_todo += c.read_text(encoding="utf-8", errors="ignore")
    sobran = [
        p.name
        for p in sorted(fuentes.iterdir())
        if p.is_file() and p.name not in css_todo and p.suffix in (".ttf", ".otf", ".woff", ".woff2")
    ]
    if sobran:
        print("  ! Estas fuentes no las usa ningún CSS (si no las necesitas, bórralas con git rm):")
        for s in sobran:
            print("      fonts/" + s)


def reescribir_font_face(texto):
    """Cambia el src de Monocraft a woff2 (con ttf de reserva) si el woff2 existe."""
    def cambia(m):
        base = m.group(1)
        if not (RAIZ / "fonts" / f"{base}.woff2").exists():
            return m.group(0)
        return (
            f"src: url('fonts/{base}.woff2') format('woff2'),\n"
            f"       url('fonts/{base}.ttf') format('truetype');"
        )
    return re.sub(r"src: url\('fonts/(Monocraft(?:-Bold)?)\.ttf'\) format\('truetype'\);", cambia, texto)


# --------------------------------------------------------------------------
# 5 · Dividir style.css
# --------------------------------------------------------------------------
# (nombre, primera línea, última línea, texto que debe aparecer en esa zona)
TROZOS = [
    ("00-base", 1, 1025, None),
    ("10-certificaciones", 1026, 1161, "Certificaciones"),
    ("20-contacto", 1162, 1421, "Página de contacto"),
    ("25-responsive", 1422, 1445, "Responsive general"),
    ("30-proyectos", 1446, 1741, "Página de proyectos"),
    ("35-qr-footer", 1742, 1784, "QR en el footer"),
    ("40-noticias", 1785, 1933, "Noticias IA"),
    ("50-identidad", 1934, 2074, "Logo SVG propio"),
    ("60-skin-picker", 2075, 2134, "SKINS"),
    ("61-skin-omarchy-casos", 2135, 2726, "OMARCHY"),
    ("62-skin-minecraft", 2727, 3838, "MINECRAFT"),
    ("63-skin-matrix", 3839, 4377, "MATRIX"),
    ("64-skin-omarchy", 4378, 4915, "OMARCHY"),
    ("65-skins-personalidad", 4916, 5013, "PERSONALIDAD"),
    ("70-movil", 5014, 5044, "Pulido móvil"),
    ("80-portada", 5045, 5104, "Portada"),
    ("81-carrusel", 5105, 5167, "CARRUSEL"),
]
DUPLICADO_DESDE = 5168  # bloque idéntico al 81-carrusel


def paso_css():
    print("\n== 5 · Dividir style.css ==")
    ruta = RAIZ / "style.css"
    if not ruta.exists():
        print("  = no hay style.css (¿ya está dividido?)")
        return
    texto, nl = leer(ruta)
    lineas = texto.split("\n")
    if len(lineas) < 5200:
        print(f"  ! style.css tiene {len(lineas)} líneas y esperaba unas 5230. "
              "Es otra versión: no lo toco para no romperlo.")
        return

    def zona(a, b):
        return "\n".join(lineas[a - 1 : b])

    # Comprobaciones de seguridad: cada trozo empieza donde esperamos
    for nombre, a, b, clave in TROZOS:
        if clave and clave.lower() not in "\n".join(lineas[a - 1 : a + 3]).lower():
            print(f"  ! El trozo {nombre} no empieza donde esperaba (línea {a}). No toco nada.")
            return
    if zona(5105, 5167).strip() != zona(DUPLICADO_DESDE, len(lineas)).strip():
        print("  ! El bloque del carrusel ya no está duplicado igual; no lo quito. No toco nada.")
        return

    destino = RAIZ / "css"
    aviso(f"  + creo {len(TROZOS)} ficheros en css/ y quito {len(lineas) - DUPLICADO_DESDE + 1} líneas duplicadas")
    for nombre, a, b, _ in TROZOS:
        contenido = zona(a, b).rstrip("\n") + "\n"
        if nombre == "00-base":
            contenido = reescribir_font_face(contenido)
        if not SIMULAR:
            destino.mkdir(exist_ok=True)
            (destino / f"{nombre}.css").write_bytes(contenido.replace("\n", nl).encode("utf-8"))
        print(f"      css/{nombre}.css  {len(contenido) / 1024:6.1f} KB")

    copia_seguridad(ruta)
    if not SIMULAR:
        ruta.unlink()
        print("  style.css movido a _backup_mejoras/ (ya no se usa)")

    enlaces = "\n".join(
        f'  <link rel="stylesheet" href="css/{n}.css" />' for n, *_ in TROZOS
    )
    patron = re.compile(r'[ \t]*<link rel="stylesheet" href="style\.css"\s*/?>')
    for nombre in PAGINAS:
        pagina = RAIZ / f"{nombre}.html"
        if not pagina.exists():
            continue
        html, nlp = leer(pagina)
        if "css/00-base.css" in html:
            continue
        nuevo, n = patron.subn(enlaces, html, count=1)
        if n:
            copia_seguridad(pagina)
            escribir(pagina, nuevo, nlp)
            aviso(f"  + {pagina.name}: enlaces CSS actualizados")
        else:
            print(f"  ! {pagina.name}: no encuentro el <link> a style.css")


if __name__ == "__main__":
    if not (RAIZ / "index.html").exists():
        sys.exit("Ejecútame desde la carpeta raíz del repositorio (donde está index.html).")
    paso_og()
    paso_imagenes()
    paso_fuentes()   # antes que el CSS: así el @font-face solo cambia si el woff2 existe
    paso_css()
    print("\nListo. Ahora: abre la web con Live Server, prueba las 4 skins (sobre todo Minecraft),"
          "\nrevisa la consola (F12) y vuelve a pasar Lighthouse.")