/**

 * @author Jose75
 * @version 1.1.0
 */



/**

 * @param {string} correo - Correo a validar.
 * @returns {boolean} true si el formato es válido, false en caso contrario.
 
 * @example

function validarCorreo(correo) {
    if (typeof correo !== "string") return false;
    const valor = correo.trim();
    const patron = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
    return patron.test(valor) && !valor.includes("..");
}

/**
 * @param {string} texto - Texto a validar.
 * @returns {boolean} true si solo contiene letras, false en caso contrario.
 *
 * @example
  
 */
function soloLetras(texto) {
    if (typeof texto !== "string") return false;
    const patron = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+( [A-Za-zÁÉÍÓÚáéíóúÜüÑñ]+)*$/;
    return patron.test(texto.trim());
}

/**
 * @param {(string|number)} numero - Número a validar (ej. teléfono, código postal).
 * @param {number} maxLongitud - Cantidad máxima de dígitos permitidos.
 * @returns {boolean} true si solo tiene dígitos y 1 <= longitud <= maxLongitud.
 *
 * @example
 */
function validarLongitud(numero, maxLongitud) {
    if (numero === null || numero === undefined) return false;
    if (!Number.isInteger(maxLongitud) || maxLongitud <= 0) return false;
    const valor = String(numero).trim();
    return /^\d+$/.test(valor) && valor.length <= maxLongitud;
}

/**
 * @private
 * @param {(string|Date)} fecha
 * @returns {(Date|null)} Fecha válida o null si no existe (ej. 2023-02-30).
 */
function _convertirFecha(fecha) {
    if (fecha instanceof Date) {
        return isNaN(fecha.getTime()) ? null : fecha;
    }
    if (typeof fecha !== "string") return null;

    const partes = fecha.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!partes) return null;

    const anio = Number(partes[1]);
    const mes = Number(partes[2]);
    const dia = Number(partes[3]);
    const resultado = new Date(anio, mes - 1, dia);

    if (resultado.getFullYear() !== anio || resultado.getMonth() !== mes - 1 || resultado.getDate() !== dia) {
        return null;
    }
    return resultado;
}

/**
 * @param {(string|Date)} fechaNacimiento - "AAAA-MM-DD" (formato de <input type="date">) o Date.
 * @returns {number} Edad en años enteros, o -1 si la fecha es inválida o futura.
 *
 * @example
 */
function calcularEdad(fechaNacimiento) {
    const nacimiento = _convertirFecha(fechaNacimiento);
    if (!nacimiento) return -1;

    const hoy = new Date();
    if (nacimiento > hoy) return -1;

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const aunNoCumple =
        hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());

    if (aunNoCumple) edad--;
    return edad;
}

/**
 * @param {(string|Date)} fechaNacimiento - "AAAA-MM-DD" o Date.
 * @returns {boolean} true si tiene 18 años o más.
 *
 * @example

 */
function esMayorDeEdad(fechaNacimiento) {
    return calcularEdad(fechaNacimiento) >= 18;
}

/**
 * @param {string} password - Contraseña a validar.
 * @returns {boolean} true si cumple todos los requisitos.
 *
 * @example
 */
function validarPassword(password) {
    if (typeof password !== "string") return false;
    const patron = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,}$/;
    return patron.test(password);
}

/* =====================================================================
   SECCIÓN LIBRE — FUNCIONES PROPIAS
   ===================================================================== */

/**
 * @param {string} curp - CURP a validar (mayúsculas o minúsculas).
 * @returns {boolean} true si la CURP es válida.
 *
 * @example
 */
function validarCURP(curp) {
    if (typeof curp !== "string") return false;
    const valor = curp.trim().toUpperCase();

    const estados = "AS|BC|BS|CC|CL|CM|CS|CH|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE";
    const patron = new RegExp(
        "^[A-Z][AEIOUX][A-Z]{2}" +      // iniciales
        "(\\d{2})(\\d{2})(\\d{2})" +    // AAMMDD
        "[HMX]" +                       // sexo
        "(" + estados + ")" +           // entidad
        "[B-DF-HJ-NP-TV-Z]{3}" +        // consonantes internas
        "[0-9A-Z]" +                    // diferenciador de siglo
        "\\d$"                          // dígito verificador
    );
    const partes = valor.match(patron);
    if (!partes) return false;

    const siglo = /\d/.test(valor[16]) ? 1900 : 2000;
    const fecha = `${siglo + Number(partes[1])}-${partes[2]}-${partes[3]}`;
    if (!_convertirFecha(fecha)) return false;

    const diccionario = "0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
    let suma = 0;
    for (let i = 0; i < 17; i++) {
        suma += diccionario.indexOf(valor[i]) * (18 - i);
    }
    const digito = (10 - (suma % 10)) % 10;
    return digito === Number(valor[17]);
}

/**
 * @param {(string|number)} telefono - Teléfono como lo escribió el usuario.
 * @returns {(string|null)} Teléfono formateado, o null si no tiene 10 dígitos.
 *
 * @example 
 */
function formatearTelefono(telefono) {
    if (telefono === null || telefono === undefined) return null;
    let digitos = String(telefono).replace(/\D/g, "");

    if (digitos.length === 12 && digitos.startsWith("52")) {
        digitos = digitos.slice(2);
    }

    if (digitos.length !== 10 || !validarLongitud(digitos, 10)) return null;
    return `${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`;
}

/**
 * @param {(string|number)} cp - Código postal a validar.
 * @returns {boolean} true si el código postal es válido.
 *
 * @example
 */
function validarCodigoPostal(cp) {
    if (cp === null || cp === undefined) return false;
    const valor = String(cp).trim();
    return validarLongitud(valor, 5) && valor.length === 5 && !valor.startsWith("00");
}

/**
 * @param {string} rfc - RFC a validar (mayúsculas o minúsculas).
 * @param {string} [curp] - (Opcional) CURP de la misma persona para comparar.
 * @returns {boolean} true si el RFC es válido (y coincide con la CURP, si se envió).
 * @example
 
 */
function validarRFC(rfc, curp) {
    if (typeof rfc !== "string") return false;
    const valor = rfc.trim().toUpperCase();

    const partes = valor.match(/^[A-ZÑ&]{4}(\d{2})(\d{2})(\d{2})[A-Z0-9]{3}$/);
    if (!partes) return false;

    // El año trae 2 dígitos: se acepta si la fecha existe en el siglo XX o XXI
    const resto = `-${partes[2]}-${partes[3]}`;
    const existe = _convertirFecha(`19${partes[1]}${resto}`) || _convertirFecha(`20${partes[1]}${resto}`);
    if (!existe) return false;

    if (curp !== undefined && curp !== null && curp !== "") {
        return valor.slice(0, 10) === String(curp).trim().toUpperCase().slice(0, 10);
    }
    return true;
}
