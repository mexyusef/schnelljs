import { FunctionCallOptions, FunctionOptions } from "./FunctionOptions.js";
export declare function executeFunction<INPUT, OUTPUT>(fn: (input: INPUT, options: FunctionCallOptions) => PromiseLike<OUTPUT>, input: INPUT, options?: FunctionOptions): Promise<OUTPUT>;
