"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const v1_1 = __importDefault(require("uuid/v1"));
const tunnel_1 = __importDefault(require("tunnel"));
const url_1 = __importDefault(require("url"));
class Client {
    constructor(version, axiosInstance, auth) {
        this.baseURL = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
        this.sessionId = v1_1.default();
        this.shell = process.env.SHELL || "";
        this.os = `${os_1.default.platform()} ${os_1.default.release()}`;
        this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
        this.version = version;
        var protocol = this.baseURL.startsWith("https:") ? "https" : this.baseURL.startsWith("http:") ? "http" : "";
        var proxyEnv = protocol + "_proxy";
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        var agent;
        if (proxyUrl && protocol) {
            proxyUrl = proxyUrl.startsWith("http") ? proxyUrl : "http://" + proxyUrl;
            var parsedProxyUrl = url_1.default.parse(proxyUrl);
            var tunnel = (protocol === "http") ? tunnel_1.default.httpOverHttp : tunnel_1.default.httpsOverHttp;
            var proxy = {
                host: parsedProxyUrl.hostname,
                port: parsedProxyUrl.port
            };
            if (parsedProxyUrl.auth) {
                var proxyUrlAuth = parsedProxyUrl.auth.split(':');
                proxy.auth = {
                    username: proxyUrlAuth[0],
                    password: proxyUrlAuth[1]
                };
            }
            agent = tunnel({
                proxy: proxy
            });
        }
        this.instance =
            axiosInstance ||
                axios_1.default.create({
                    baseURL: this.baseURL,
                    headers: {
                        "Content-Type": "application/json",
                        "X-kmdr-client-os": this.os,
                        "X-kmdr-client-session-id": this.sessionId,
                        "X-kmdr-client-shell": this.shell,
                        "X-kmdr-client-term": this.term,
                        "X-kmdr-client-version": this.version,
                    },
                    responseType: "json",
                    httpsAgent: agent,
                    proxy: false
                });
    }
    doQuery(query, variables, config) {
        return this.post({ query, variables }, config);
    }
    doMutation(query, variables) {
        return this.post({ query, variables });
    }
    post(data, config) {
        return this.instance.post("", data, Object.assign({}, config));
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map