"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("../graphql");
const client_1 = __importDefault(require("./client"));
class Explain extends client_1.default {
    constructor(version) {
        super(version);
    }
    async getExplanation(query, schema) {
        const transformResponse = (res) => {
            if (res) {
                try {
                    const obj = JSON.parse(res);
                    return obj.data;
                }
                catch (err) {
                    throw err;
                }
            }
        };
        return super.doQuery(graphql_1.queryExplainCommand, { query }, { transformResponse });
    }
    async sendFeedback(answer, comment) {
        return super.doMutation(graphql_1.mutationCreateExplainFeedback, { answer, comment });
    }
}
exports.default = Explain;
//# sourceMappingURL=explain.js.map