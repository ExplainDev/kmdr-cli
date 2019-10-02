"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const tunnel_1 = __importDefault(require("tunnel"));
const url_1 = __importDefault(require("url"));
const constants_1 = require("./constants");
class Client {
    constructor(axiosInstance) {
        this.baseURL = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
        this.shell = process.env.SHELL || "";
        this.os = `${os_1.default.platform()} ${os_1.default.release()}`;
        this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
        this.version = constants_1.KMDR_CLI_VERSION;
        this.isHttps = this.baseURL.startsWith("https:");
        const axiosConfig = {
            baseURL: this.baseURL,
            headers: {
                "Content-Type": "application/json",
                "X-kmdr-client-os": this.os,
                "X-kmdr-client-shell": this.shell,
                "X-kmdr-client-term": this.term,
                "X-kmdr-client-version": this.version,
            },
            responseType: "json",
        };
        const proxyEnv = this.isHttps ? "https_proxy" : "http_proxy";
        let proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (this.isHttps && proxyUrl) {
            proxyUrl = proxyUrl.startsWith("http") ? proxyUrl : "http://" + proxyUrl;
            const parsedProxyUrl = url_1.default.parse(proxyUrl);
            const proxy = {
                host: parsedProxyUrl.hostname || "",
                port: parseInt(parsedProxyUrl.port || "", 10),
                proxyAuth: parsedProxyUrl.auth,
            };
            let httpsAgent;
            httpsAgent = tunnel_1.default.httpsOverHttp({ proxy });
            axiosConfig.httpsAgent = httpsAgent;
            axiosConfig.proxy = false;
        }
        this.instance = axiosInstance || axios_1.default.create(axiosConfig);
    }
    doQuery(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    /**
     * Send GraphQL mutation to the API server
     *
     * @param query
     * @param variables
     * @param config
     */
    doMutation(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    post(data, config) {
        return this.instance.post("", data, Object.assign({}, config));
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map