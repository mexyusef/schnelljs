/**
 * The `throttleOff` strategy does not limit parallel API calls.
 */
export const throttleOff = () => (fn) => fn();
