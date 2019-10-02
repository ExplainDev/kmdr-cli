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

// find a better home for this
const transformResponse = (res: string) => {
  if (res) {
    try {
      const obj = JSON.parse(res) as GraphQLResponse;
      return obj.data;
    } catch (err) {
      throw err;
    }
  }
};

export class ExplainClient extends Client implements ExplainClientInstance {
  constructor() {
    super();
  }

  public async getExplanation(query: string, schema?: string): Promise<ExplainResponse> {
    return super.doQuery(queryExplain, { query }, { transformResponse }) as Promise<
      ExplainResponse
    >;
  }

  public async getRelatedPrograms(programName: string): Promise<RelatedProgramsResponse> {
    return super.doQuery(queryRelated, { programName }, { transformResponse }) as Promise<
      RelatedProgramsResponse
    >;
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
