"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const graphql_1 = require("../graphql");
class Explain extends client_1.default {
    constructor() {
        super();
    }
    getExplanation(query, schema) {
        const _super = Object.create(null, {
            doQuery: { get: () => super.doQuery }
        });
        return __awaiter(this, void 0, void 0, function* () {
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
            return _super.doQuery.call(this, graphql_1.queryExplainCommand, { query }, { transformResponse });
        });
    }
    sendFeedback(answer, comment) {
        const _super = Object.create(null, {
            doMutation: { get: () => super.doMutation }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.doMutation.call(this, graphql_1.mutationCreateExplainFeedback, { answer, comment });
        });
    }
}
exports.default = Explain;
//# sourceMappingURL=explain.js.map