import { AxiosRequestConfig } from "axios";
import Client from "../client";
import { mutationCreateExplainFeedback, queryExplain, queryRelated } from "../graphql";
import {
  ExplainClientInstance,
  ExplainFeedbackResponse,
  ExplainResponse,
  GraphQLResponse,
  RelatedProgramsResponse,
} from "../interfaces";

export default class ExplainClient extends Client implements ExplainClientInstance {
  constructor() {
    super();
  }

  public async getExplanation(query: string, schema?: string): Promise<ExplainResponse> {
    return super.doQuery(queryExplain, { query }) as Promise<ExplainResponse>;
  }

  public async getRelatedPrograms(programName: string): Promise<RelatedProgramsResponse> {
    return super.doQuery(queryRelated, { programName }) as Promise<RelatedProgramsResponse>;
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
