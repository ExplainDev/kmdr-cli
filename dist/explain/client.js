"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("../client"));
const queryExplain = `
query Explain($query: String!) {
  explain(query: $query) {
    query
    ast
  }
}
`;
const queryExplainWithRelatedPrograms = `
query Explain($query: String!) {
  explain(query: $query) {
    query
    ast
    relatedPrograms {
      name
    }
  }
}
`;
const mutationCreateExplainFeedback = `
mutation createExplainFeedback($answer: String!, $comment: String) {
  createExplainFeedback(answer: $answer, comment: $comment) {
    answer
    comment
  }
}
`;
class ExplainClient extends client_1.default {
    constructor() {
        super();
    }
    async getExplanation(query, showRelatedPrograms = false) {
        if (!showRelatedPrograms) {
            return super.doQuery(queryExplain, { query });
        }
        else {
            return super.doQuery(queryExplainWithRelatedPrograms, { query });
        }
    }
    async sendFeedback(sessionId, answer, comment) {
        const config = {
            headers: {
                "x-kmdr-client-session-id": sessionId,
            },
        };
        return super.doMutation(mutationCreateExplainFeedback, { answer, comment }, config);
    }
}
exports.default = ExplainClient;
//# sourceMappingURL=client.js.map