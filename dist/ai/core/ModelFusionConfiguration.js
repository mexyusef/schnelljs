let globalLogFormat = undefined;
let globalFunctionObservers = [];
export function setFunctionObservers(functionObservers) {
    globalFunctionObservers = functionObservers;
}
export function getFunctionObservers() {
    return globalFunctionObservers;
}
export function setLogFormat(format) {
    globalLogFormat = format;
}
export function getLogFormat() {
    return globalLogFormat;
}
