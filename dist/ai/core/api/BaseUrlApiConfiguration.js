import { AbstractApiConfiguration } from "./AbstractApiConfiguration.js";
/**
 * An API configuration that uses different URL parts and a set of headers.
 *
 * You can use it to configure custom APIs for models, e.g. your own internal OpenAI proxy with custom headers.
 */
export class BaseUrlApiConfiguration extends AbstractApiConfiguration {
    constructor({ baseUrl, headers, retry, throttle, customCallHeaders, }) {
        super({ retry, throttle, customCallHeaders });
        Object.defineProperty(this, "baseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fixedHeadersValue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.baseUrl = typeof baseUrl == "string" ? parseBaseUrl(baseUrl) : baseUrl;
        this.fixedHeadersValue = headers ?? {};
    }
    fixedHeaders() {
        return this.fixedHeadersValue;
    }
    assembleUrl(path) {
        let basePath = this.baseUrl.path;
        // ensure base path ends without a slash
        if (basePath.endsWith("/")) {
            basePath = basePath.slice(0, -1);
        }
        // ensure path starts with a slash
        if (!path.startsWith("/")) {
            path = `/${path}`;
        }
        return `${this.baseUrl.protocol}://${this.baseUrl.host}:${this.baseUrl.port}${basePath}${path}`;
    }
}
export class BaseUrlApiConfigurationWithDefaults extends BaseUrlApiConfiguration {
    constructor({ baseUrlDefaults, baseUrl, headers, retry, throttle, customCallHeaders, }) {
        super({
            baseUrl: resolveBaseUrl(baseUrl, baseUrlDefaults),
            headers,
            retry,
            throttle,
            customCallHeaders,
        });
    }
}
function parseBaseUrl(baseUrl) {
    const url = new URL(baseUrl);
    return {
        protocol: url.protocol.slice(0, -1), // remove trailing colon
        host: url.hostname,
        port: url.port,
        path: url.pathname,
    };
}
function resolveBaseUrl(baseUrl = {}, baseUrlDefaults) {
    if (typeof baseUrl == "string") {
        return baseUrl;
    }
    else {
        return {
            protocol: baseUrl.protocol ?? baseUrlDefaults.protocol,
            host: baseUrl.host ?? baseUrlDefaults.host,
            port: baseUrl.port ?? baseUrlDefaults.port,
            path: baseUrl.path ?? baseUrlDefaults.path,
        };
    }
}
