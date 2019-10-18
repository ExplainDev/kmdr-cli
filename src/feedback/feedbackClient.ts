import { AxiosRequestConfig } from "axios";
import Client from "../client";
import { FeedbackResponse } from "../interfaces";

const mutationCreateFeedback = `
mutation createFeedback($message: String!,  $email: String) {
  createFeedback(message: $message, email: $email) {
    message
  }
}
`;

export default class FeedbackClient extends Client {
  constructor() {
    super();
  }

  public async sendFeedback(message: string, email: string): Promise<FeedbackResponse> {
    return super.doMutation(mutationCreateFeedback, { message, email });
  }
}
