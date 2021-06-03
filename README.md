# deno_plugin_helper
Provides abstractions, types and helpers for Deno plugins

This module makes working with the current Deno plugin system (deno 1.10.3) much easier by providing a helper file that can give you type definitions and automatic building/loading for your plugin.

It consists of two parts (in `/plugin`):

- `pluginHelper.ts`: Provides automatic building of the Rust library and loads it. Also provides type definitions for executing the functions in the Rust library.
- `pluginCore.js`: A simple file that just calls the actual Deno methods. (It has to be in a .js becasue currently there are missing type definitions)

See [index.ts](/index.ts) and [lib.rs](/plugin/src/lib.rs) for an example on how to use it.

LICENSE: MIT

