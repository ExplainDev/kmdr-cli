import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
import { ExplainCommandResponse, AuthCredentials } from "../interfaces";

class Client {
  private baseURL: string = "http://localhost:8081/api/graphql";
  private username?: string;
  private token?: string;

  private instance: AxiosInstance;

  constructor(axiosInstance?: AxiosInstance, auth?: AuthCredentials) {
    if (auth) {
      this.username = auth.username;
      this.token = auth.token;
    }

    this.instance =
      axiosInstance ||
      axios.create({
        baseURL: this.baseURL,
        headers: {
          "Content-Type": "application/json",
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

  public config() {}
}

export default Client;
