export async function delay(delayInMs) {
    return new Promise((resolve) => setTimeout(resolve, delayInMs));
}
