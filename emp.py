# =======================================
# INICIO FICHERO >> ./scripts/empaquetar_ficheros.py
# =======================================
"""
Script que recorre recursivamente una ruta base, lee todos los archivos útiles,
y genera un archivo único con bloques formateados como:

=======================================
INICIO FICHERO >> ./ruta/fichero.ext
=======================================
...contenido...
=======================================
FIN FICHERO >> ./ruta/fichero.ext
=======================================
"""

import os

SEPARADOR = "=" * 39

IGNORAR_CARPETAS = {
    '.git', 'node_modules', '__pycache__', '.idea', '.vscode', '.vercel', '.github', 'test-results',
    'results', 'public', 'docs', 'allure-results', 'screenshots', 'playwright-report', 'coverage', '.nyc_output',
    'historico','webapp','resumen','snapshots'
}

IGNORAR_ARCHIVOS = {
    'empacar.py',
    'd.py',
    'code.txt',
    'back.txt',
    'resumen_ejecutivo_v1.0.md',
    'package-lock.json',
    'README.md',
    'readm3.md',
    '.gitignore',
    'a',
    'planmejora.md'
}

def empaquetar_directorio(ruta_base, archivo_salida="proyecto_empaquetado.txt"):
    bloques = []
    archivos_contados = 0
    ruta_base = os.path.abspath(ruta_base)
    ruta_script = os.path.abspath(__file__)

    for root, dirs, files in os.walk(ruta_base):
        nuevos_dirs = []
        public_raiz = os.path.abspath(os.path.join(ruta_base, 'public'))

        for d in dirs:
            ruta_carpeta = os.path.abspath(os.path.join(root, d))

            if d in IGNORAR_CARPETAS:
                if d == 'public' and ruta_carpeta == public_raiz:
                    continue  # Ignorar solo ./public raíz
                elif d != 'public':
                    continue  # Ignorar otras carpetas listadas
            nuevos_dirs.append(d)

        dirs[:] = nuevos_dirs

        for nombre_fichero in files:
            if nombre_fichero in IGNORAR_ARCHIVOS or nombre_fichero.startswith('.'):
                continue

            ruta_completa = os.path.join(root, nombre_fichero)
            if os.path.abspath(ruta_completa) == ruta_script:
                continue  # No empaquetar el propio script

            try:
                with open(ruta_completa, "r", encoding="utf-8", errors="ignore") as f:
                    contenido = f.read().strip()

                if contenido:
                    ruta_relativa = os.path.relpath(ruta_completa, start=".")
                    bloque = (
                        f"{SEPARADOR}\n"
                        f"INICIO FICHERO >> ./{ruta_relativa}\n"
                        f"{SEPARADOR}\n"
                        f"{contenido}\n"
                        f"{SEPARADOR}\n"
                        f"FIN FICHERO >> ./{ruta_relativa}\n"
                        f"{SEPARADOR}"
                    )
                    bloques.append(bloque)
                    archivos_contados += 1
            except Exception as e:
                print(f"⚠️ Error leyendo {ruta_completa}: {e}")

    if not bloques:
        print("⚠️ No se encontraron archivos útiles para empaquetar.")
    else:
        with open(archivo_salida, "w", encoding="utf-8") as f:
            f.write("\n\n".join(bloques))
        print(f"📦 Empaquetado completo: {archivo_salida} ({archivos_contados} archivos)")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python empaquetar_ficheros.py ruta_base [archivo_salida.txt]")
    else:
        ruta_base = sys.argv[1]
        archivo_salida = sys.argv[2] if len(sys.argv) > 2 else "proyecto_empaquetado.txt"
        empaquetar_directorio(ruta_base, archivo_salida)
# =======================================
# FIN FICHERO >> ./scripts/empaquetar_ficheros.py
# =======================================
