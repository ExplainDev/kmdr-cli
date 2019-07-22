import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import os from "os";
import uuid from "uuid/v1";
import { AuthCredentials } from "../interfaces";

class Client {
  private baseURL: string = "http://localhost:8081/api/graphql";
  private shell: string;
  private term: string;
  private os: string;
  private sessionId: string;
  private instance: AxiosInstance;

  constructor(axiosInstance?: AxiosInstance, auth?: AuthCredentials) {
    this.sessionId = uuid();
    this.shell = process.env.SHELL || "";
    this.os = `${os.platform()} ${os.release()}`;
    this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;

    this.instance =
      axiosInstance ||
      axios.create({
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

  protected doQuery(
    query: string,
    variables?: {},
    config: AxiosRequestConfig | undefined = undefined,
  ) {
    return this.post({ query, variables }, config);
  }

  protected doMutation(query: string, variables?: {}) {
    this.post({ query, variables });
  }

  private post(data: any, config: AxiosRequestConfig | undefined = undefined) {
    return this.instance.post("", data, { ...config });
  }
}

export default Client;
