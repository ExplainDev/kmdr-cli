"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const os_1 = __importDefault(require("os"));
const v1_1 = __importDefault(require("uuid/v1"));
class Client {
    constructor(axiosInstance, auth) {
        this.baseURL = "https://api.kmdr.sh/api/graphql";
        this.sessionId = v1_1.default();
        this.shell = process.env.SHELL || "";
        this.os = `${os_1.default.platform()} ${os_1.default.release()}`;
        this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
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
                        "X-kmdr-client-version": "0.1",
                    },
                    responseType: "json",
                });
    }
    doQuery(query, variables, config = undefined) {
        return this.post({ query, variables }, config);
    }
    doMutation(query, variables) {
        this.post({ query, variables });
    }
    post(data, config = undefined) {
        return this.instance.post("", data, Object.assign({}, config));
    }
}
exports.default = Client;
//# sourceMappingURL=client.js.map