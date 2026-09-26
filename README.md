# utileria.js

**Autor:** Joseph — Ingeniería en Sistemas Computacionales, TecNM Campus Oaxaca

🔗 **Demo en vivo:** https://josejose7520-dev.github.io/Utileria/
📁 **Repositorio:** https://github.com/JoseJose7520-dev/Utileria

---

## ¿Qué problema resuelve?

Cada vez que se construye un formulario se vuelven a escribir las mismas validaciones: que el correo tenga `@`, que el nombre no traiga números, que la contraseña sea segura, que la persona sea mayor de edad... y casi siempre con errores (por ejemplo, calcular la edad solo restando años, o aceptar una CURP inventada con tal de que tenga 18 caracteres).

**utileria.js** reúne esas validaciones en un solo archivo de JavaScript puro:

- ✅ Sin frameworks ni dependencias
- ✅ Sin componentes visuales: solo funciones que reciben un dato y devuelven un resultado
- ✅ Pensada para formularios mexicanos: acentos, ñ, CURP, RFC, códigos postales y teléfonos de 10 dígitos

---

## Instalación

1. Descarga el archivo `js/utileria.js` y colócalo en tu proyecto.
2. Enlázalo **antes** de tu propio script:

```html
<script src="js/utileria.js"></script>
<script src="js/mi-script.js"></script>
```

Todas las funciones quedan disponibles de forma global; no requiere `import` ni instalación con npm.

---

## Funciones

| Función | Retorna | Descripción |
|---|---|---|
| `validarCorreo(correo)` | `boolean` | Valida el formato de correo electrónico |
| `soloLetras(texto)` | `boolean` | Solo letras (acepta acentos, ü, ñ y espacios entre palabras) |
| `validarLongitud(numero, maxLongitud)` | `boolean` | Solo dígitos y que no exceda `maxLongitud` |
| `calcularEdad(fechaNacimiento)` | `number` | Edad en años cumplidos (`-1` si la fecha es inválida o futura) |
| `esMayorDeEdad(fechaNacimiento)` | `boolean` | `true` si tiene 18 años o más |
| `validarPassword(password)` | `boolean` | Mayúscula, minúscula, número, carácter especial y mínimo 8 |
| `validarCURP(curp)` ⭐ | `boolean` | CURP con estructura, fecha, entidad y **dígito verificador** |
| `formatearTelefono(telefono)` ⭐ | `string \| null` | Limpia un teléfono y lo deja como `951 123 4567` |
| `validarCodigoPostal(cp)` ⭐ | `boolean` | Código postal mexicano de 5 dígitos (del `01000` al `99999`) |
| `validarRFC(rfc, curp?)` ⭐ | `boolean` | RFC de persona física; opcionalmente verifica que coincida con la CURP |

⭐ = funciones propias (sección libre)

---

## Uso

### validarCorreo(correo)

Valida que el texto tenga la forma `usuario@dominio.ext`, sin espacios ni puntos seguidos.

```javascript
validarCorreo("joseph@itoaxaca.mx");   // true
validarCorreo("joseph@itoaxaca");      // false  (sin extensión)
validarCorreo("jose..ph@gmail.com");   // false  (puntos seguidos)
```

### soloLetras(texto)

Acepta letras mayúsculas y minúsculas, vocales acentuadas, `ü` y `ñ`. Permite un espacio entre palabras para validar nombres completos.

```javascript
soloLetras("María José");   // true
soloLetras("Ñandú");        // true
soloLetras("Juan123");      // false
soloLetras("");             // false
```

### validarLongitud(numero, maxLongitud)

Verifica que el valor contenga solo dígitos y que su longitud no supere el máximo indicado. Acepta número o texto.

```javascript
validarLongitud("9511234567", 10);   // true
validarLongitud(68000, 5);           // true   (código postal)
validarLongitud(123456, 5);          // false  (6 dígitos)
validarLongitud("12a4", 5);          // false  (contiene una letra)
```

### calcularEdad(fechaNacimiento)

Recibe una fecha `"AAAA-MM-DD"` (el formato que entrega `<input type="date">`) o un objeto `Date`. Toma en cuenta si ya pasó el cumpleaños este año.

```javascript
// Suponiendo que hoy es 23/09/2026
calcularEdad("2005-03-15");   // 21
calcularEdad("2005-09-24");   // 20  (aún no cumple)
calcularEdad("2030-01-01");   // -1  (fecha futura)
calcularEdad("2023-02-30");   // -1  (fecha inexistente)
```

> **Detalle técnico:** `new Date("2005-09-23")` se interpreta en hora UTC, y en México eso puede recorrer la fecha un día hacia atrás. Por eso la librería construye la fecha con `new Date(año, mes - 1, día)`.

### esMayorDeEdad(fechaNacimiento)

Usa `calcularEdad` y compara contra 18 años (mayoría de edad en México).

```javascript
esMayorDeEdad("2000-01-01");   // true
esMayorDeEdad("2015-06-10");   // false
esMayorDeEdad("no-es-fecha");  // false
```

### validarPassword(password)

Requiere al menos una mayúscula, una minúscula, un número, un carácter especial, mínimo 8 caracteres y sin espacios.

```javascript
validarPassword("Oaxaca#2026");   // true
validarPassword("oaxaca2026");    // false  (sin mayúscula ni especial)
validarPassword("Oax#1");         // false  (menos de 8)
validarPassword("Oaxaca 2026#");  // false  (contiene espacio)
```

### ⭐ validarCURP(curp)

**Problema que resuelve:** muchos formularios solo revisan que la CURP tenga 18 caracteres, así que aceptan CURPs con errores de dedo. Esta función revisa:

1. La estructura oficial (letras, fecha `AAMMDD`, sexo `H/M/X`, clave de estado, consonantes).
2. Que la fecha de nacimiento exista (no acepta `30 de febrero`).
3. El **dígito verificador** (último carácter), con el mismo algoritmo que usa RENAPO.

```javascript
validarCURP("HEGG560427MVZRRL04");   // true   (CURP de ejemplo oficial de RENAPO)
validarCURP("hegg560427mvzrrl04");   // true   (acepta minúsculas)
validarCURP("HEGG560427MVZRRL09");   // false  (dígito verificador incorrecto)
validarCURP("HEGG560230MVZRRL04");   // false  (30 de febrero no existe)
```

### ⭐ formatearTelefono(telefono)

**Problema que resuelve:** cada usuario escribe su teléfono distinto — `(951) 123-45-67`, `951.123.4567`, `+52 9511234567`. Esta función limpia cualquier formato y lo deja uniforme para guardarlo o mostrarlo.

```javascript
formatearTelefono("(951) 123-45-67");   // "951 123 4567"
formatearTelefono("+52 951 123 4567");  // "951 123 4567"
formatearTelefono(9511234567);          // "951 123 4567"
formatearTelefono("12345");             // null
```

### ⭐ validarCodigoPostal(cp)

**Problema que resuelve:** si el código postal se guarda como número, `01000` se convierte en `1000` y se pierde el cero inicial. Esta función lo trata como texto, exige exactamente 5 dígitos y rechaza el prefijo `00`, que no existe en México. Reutiliza `validarLongitud()`.

```javascript
validarCodigoPostal("68000");   // true   (Oaxaca de Juárez)
validarCodigoPostal("01000");   // true   (conserva el cero inicial)
validarCodigoPostal("00123");   // false  (prefijo 00 no existe)
validarCodigoPostal("6800");    // false  (solo 4 dígitos)
```

### ⭐ validarRFC(rfc, curp)

**Problema que resuelve:** en un registro es fácil capturar el RFC de otra persona (el de un familiar, por ejemplo). En una persona física, los primeros 10 caracteres del RFC y de la CURP son los mismos (iniciales + fecha de nacimiento), así que la función puede cruzarlos. Revisa:

1. Estructura: 4 letras + fecha `AAMMDD` + homoclave de 3 caracteres.
2. Que la fecha exista.
3. Si se envía la CURP (parámetro opcional), que ambos documentos sean de la misma persona.

```javascript
validarRFC("HEGG560427AB1");                         // true
validarRFC("hegg560427ab1");                         // true   (acepta minúsculas)
validarRFC("HEGG561327AB1");                         // false  (mes 13 no existe)
validarRFC("HEGG560427AB1", "HEGG560427MVZRRL04");   // true   (coincide con la CURP)
validarRFC("LOPA900101AB1", "HEGG560427MVZRRL04");   // false  (son de personas distintas)
```

### Ejemplo de integración en un formulario

```html
<input type="date" id="fechaNacimiento">
<button id="btnEdad">Calcular edad</button>

<script src="js/utileria.js"></script>
<script>
    document.getElementById("btnEdad").addEventListener("click", function () {
        const fecha = document.getElementById("fechaNacimiento").value;
        const edad = calcularEdad(fecha);

        if (edad === -1) {
            alert("Fecha inválida");
        } else if (esMayorDeEdad(fecha)) {
            alert("Tienes " + edad + " años. Eres mayor de edad.");
        } else {
            alert("Tienes " + edad + " años. Eres menor de edad.");
        }
    });
</script>
```

---

## Demo incluida

| Página | Qué muestra |
|---|---|
| `index.html` | Formulario de registro que valida nombre, correo, teléfono, código postal, fecha, CURP y RFC. Al enviarlo abre una **ventana modal** con la edad calculada. |
| `login.html` | Inicio de sesión que usa `validarCorreo` y `validarPassword`, con checklist de requisitos en tiempo real. |

En `index.html`, el botón **"Ejecutar pruebas en consola"** imprime una tabla con los resultados de todas las funciones (abre la consola con `F12`).

---

## Capturas de pantalla

### Consola mostrando resultados

![Pruebas en consola](img/consola.png)

### Formulario detectando errores

![Formulario con errores](img/formulario-errores.png)

### Modal con la edad calculada

![Modal de edad](img/modal-edad.png)

### Login validado

![Login](img/login.png)

---

## Video demo (1 minuto)

▶️ [Ver video en YouTube](PEGA_AQUI_EL_LINK_DEL_VIDEO)

---

## Estructura del proyecto

```
utileria/
├── README.md
├── index.html
├── login.html
├── css/
│   └── styles.css
├── js/
│   └── utileria.js
└── img/
    ├── consola.png
    ├── formulario-errores.png
    ├── modal-edad.png
    └── login.png
```
