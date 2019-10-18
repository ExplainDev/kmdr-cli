import { AxiosRequestConfig } from "axios";
import Client from "../client";
import { ExplainFeedbackResponse, ExplainResponse } from "../interfaces";

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

export default class ExplainClient extends Client {
  constructor() {
    super();
  }

  public async getExplanation(
    query: string,
    showRelatedPrograms = false,
  ): Promise<ExplainResponse> {
    if (!showRelatedPrograms) {
      return super.doQuery(queryExplain, { query }) as Promise<ExplainResponse>;
    } else {
      return super.doQuery(queryExplainWithRelatedPrograms, { query }) as Promise<ExplainResponse>;
    }
  }

  public async sendFeedback(
    sessionId: string,
    answer: string,
    comment: string,
  ): Promise<ExplainFeedbackResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        "x-kmdr-client-session-id": sessionId,
      },
    };
    return super.doMutation(mutationCreateExplainFeedback, { answer, comment }, config);
  }
}
