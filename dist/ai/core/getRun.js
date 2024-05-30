let runStorage;
async function ensureLoaded() {
    // Note: using process[versions] instead of process.versions to avoid Next.js edge runtime warnings.
    const versions = "versions";
    const isNode = typeof process !== "undefined" &&
        process[versions] != null &&
        process[versions].node != null;
    if (!isNode)
        return Promise.resolve();
    if (!runStorage) {
        const { AsyncLocalStorage } = await import("node:async_hooks");
        runStorage = new AsyncLocalStorage();
    }
    return Promise.resolve();
}
/**
 * Returns the run stored in an AsyncLocalStorage if running in Node.js. It can be set with `withRun()`.
 */
export async function getRun(run) {
    await ensureLoaded();
    return run ?? runStorage?.getStore();
}
/**
 * Stores the run in an AsyncLocalStorage if running in Node.js. It can be retrieved with `getRun()`.
 */
export async function withRun(run, callback) {
    await ensureLoaded();
    if (runStorage != null) {
        await runStorage.run(run, () => callback(run));
    }
    else {
        await callback(run);
    }
}
