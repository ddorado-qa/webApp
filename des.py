import os
import re

def crear_ficheros_desde_bloques(path_entrada):
    with open(path_entrada, "r", encoding="utf-8") as f:
        contenido = f.read().strip()

    patron_bloque = re.compile(
        r"=+\s*\nINICIO FICHERO >> (?P<ruta>.+?)\s*\n=+\s*\n(?P<contenido>.*?)\n=+\s*\nFIN FICHERO >> (?P=ruta)\s*\n=+",
        re.DOTALL
    )
    patron_bloque2 = re.compile(
        r"INICIO FICHERO >> (?P<ruta>.+?)\n(?P<contenido>.*?)\nFIN FICHERO >> (?P=ruta)",
        re.DOTALL
    )

    bloques = patron_bloque.findall(contenido)

    if not bloques:
        print("⚠️ No se encontraron bloques válidos.")
        return

    for ruta, contenido in bloques:
        ruta = ruta.strip()
        ruta_directorio = os.path.dirname(ruta)

        # Solo crear si es necesario
        if ruta_directorio:
            os.makedirs(ruta_directorio, exist_ok=True)

        with open(ruta, "w", encoding="utf-8") as f:
            f.write(contenido.strip() + "\n")

        print(f"✅ Archivo creado: {ruta}")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python desempaquetar_ficheros.py archivo_entrada.txt")
    else:
        crear_ficheros_desde_bloques(sys.argv[1])
