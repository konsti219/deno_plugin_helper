import * as path from "https://deno.land/std@0.97.0/path/mod.ts"
import * as toml from "https://deno.land/std@0.97.0/encoding/toml.ts"

import { getOps, opSync, opAsync } from "./pluginCore.js"



const IS_REALEAS = false

// #region Initiation Phase

async function buildPlugin() {
    // always build lib
    const cargoProcess = Deno.run({
        cmd: [
            "cargo",
            "build",
            ...(IS_REALEAS ? ["--release"] : [])
        ],
        cwd: "./plugin",
        stdout: "inherit",
        stderr: "inherit",
    })
    const { code } = await cargoProcess.status()
    console.info(`Cargo build exited with code ${code}`)
}


function getLibName(): string {
    const cargoFile = toml.parse(Deno.readTextFileSync(path.join(Deno.cwd(), "plugin", "Cargo.toml")))
    const cargoPackage = cargoFile["package"] as Record<string, unknown>
    if (typeof cargoPackage === "undefined") throw new Error("missing property in Cargo.toml")

    const cargoName = cargoPackage["name"] as string
    if (cargoName === "") throw new Error("missing property in Cargo.toml")

    return (cargoName)
}

function resolveRustLibFilename(libName: string) {
    switch (Deno.build.os) {
        case "linux":
            return `lib${libName}.so`
        case "darwin":
            return `lib${libName}.dylib`
        case "windows":
            return `${libName}.dll`
        default:
            throw new Error("unexpected operating system")
    }
}

function loadPlugin() {
    // get lib full path and load it
    const libPath = path.join(Deno.cwd(), "plugin", "target", IS_REALEAS ? "release" : "debug", resolveRustLibFilename(getLibName()))
    const pluginRid = Deno.openPlugin(libPath);
    console.info(`Plugin rid: ${pluginRid}`);
}

/**
 * Builds and loads Rust plugin
 */
export async function initPlugin() {
    await buildPlugin()
    loadPlugin()
}

// #endregion



// #region Runtime phase

function getOp(opName: string): number {
    return getOps()[opName]
}

export function runSyncOp(opName: string, args: unknown, buf?: Uint8Array): unknown {
    if (!getOp(opName)) throw new Error(`requested op not registerd, op ${opName}`)

    return opSync(opName, args, buf)
}

export function runAsyncOp(opName: string, args: unknown, buf?: Uint8Array): Promise<unknown> {
    if (!getOp(opName)) throw new Error(`requested op not registerd, op ${opName}`)

    return opAsync(opName, args, buf)
}

// #endregion
