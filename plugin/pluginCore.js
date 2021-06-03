/* This file is a minimal shim to add type defs to the current plugin system */

/**
 * get all registerd ops
 * @returns {Record<string, number>}
 */
export function getOps() {
    return Deno.core.ops();
}

/**
 * Run sync op
 * @param {string} opName - Name of the op.
 * @param {unknown} args - Arguments for the op.
 * @param {Uint8Array} [buf] - buffer for the op.
 * @returns {unknown}
 */
export function opSync(opName, args, buf) {
    if (buf) return Deno.core.opSync(opName, args, buf);
    else return Deno.core.opSync(opName, args);
}

/**
 * Run async op
 * @param {string} opName - Name of the op.
 * @param {unknown} args - Arguments for the op.
 * @param {Uint8Array} [buf] - buffer for the op.
 * @returns {Promise<unknown>}
 */
export function opAsync(opName, args, buf) {
    if (buf) return Deno.core.opAsync(opName, args, buf);
    else return Deno.core.opAsync(opName, args);
}
