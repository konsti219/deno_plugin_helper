import { initPlugin, runSyncOp, runAsyncOp } from "./plugin/pluginHelper.ts"

await initPlugin()

const encoder = new TextEncoder()

const syncResult = runSyncOp("hello_world", { val: "test arg sync", foo: 420 }, encoder.encode("test sync"))
console.log(`Synchronous return: ${syncResult}`)

const start = Date.now()
const asynvPromise = runAsyncOp("hello_world_async", { val: "test arg async", foo: 1337 }, encoder.encode("test async"))
console.log(`Asynchronous return: ${await asynvPromise}`)
console.log(`Time to run: ${Date.now() - start}`)
