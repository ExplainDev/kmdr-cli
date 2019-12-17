import { AxiosRequestConfig } from "axios";
import Client from "../client";
import { ExplainFeedbackResponse, ExplainResponse, CommandResponse } from "../interfaces";

const queryExplain = `
query Explain($query: String!) {
  explain(query: $query) {
    query
    ast
    examples {
      summary
      command
      ast
    }
  }
}
`;

const queryExplainWithRelatedPrograms = `
query Explain($query: String!) {
  explain(query: $query) {
    query
    ast
    examples {
      summary
      command
      ast
    }
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

const mutationCreateCommand = `
mutation createCommand($command: String!, $summary: String) {
  createCommand(command: $command, summary: $summary) {
    command
    summary
    totalViews
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

  public async saveCommand(
    sessionId: string,
    command: string,
    summary: string,
  ): Promise<CommandResponse> {
    const config: AxiosRequestConfig = {
      headers: {
        "x-kmdr-client-session-id": sessionId,
      },
    };

    return super.doMutation(mutationCreateCommand, { command, summary }, config);
  }
}
