import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Agent } from "http";
import os from "os";
import Tunnel, { ProxyOptions } from "tunnel";
import Url from "url";
import { KMDR_CLI_VERSION } from "./constants";
import { GraphQLResponse } from "./interfaces";

export default class Client {
  protected instance: AxiosInstance;

  private baseURL: string = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
  private shell: string;
  private term: string;
  private os: string;
  private version: string;
  private isHttps: boolean;

  constructor(axiosInstance?: AxiosInstance) {
    this.shell = process.env.SHELL || "";
    this.os = `${os.platform()} ${os.release()}`;
    this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
    this.version = KMDR_CLI_VERSION;
    this.isHttps = this.baseURL.startsWith("https:");

    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-kmdr-client-os": this.os,
        "X-kmdr-client-shell": this.shell,
        "X-kmdr-client-term": this.term,
        "X-kmdr-client-version": this.version,
      },
      responseType: "json",
    };

    const proxyEnv = this.isHttps ? "https_proxy" : "http_proxy";
    let proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];

    if (this.isHttps && proxyUrl) {
      proxyUrl = proxyUrl.startsWith("http") ? proxyUrl : "http://" + proxyUrl;
      const parsedProxyUrl = Url.parse(proxyUrl);

      const proxy: ProxyOptions = {
        host: parsedProxyUrl.hostname || "",
        port: parseInt(parsedProxyUrl.port || "", 10),
        proxyAuth: parsedProxyUrl.auth,
      };

      let httpsAgent: Agent;
      httpsAgent = Tunnel.httpsOverHttp({ proxy });
      axiosConfig.httpsAgent = httpsAgent;
      axiosConfig.proxy = false;
    }

    this.instance = axiosInstance || axios.create(axiosConfig);
  }

  protected doQuery(query: string, variables?: {}, config?: AxiosRequestConfig) {
    return this.post(
      { query, variables },
      { transformResponse: this.transformGQLResponse, ...config },
    );
  }

  /**
   * Send GraphQL mutation to the API server
   *
   * @param query
   * @param variables
   * @param config
   */
  protected doMutation(query: string, variables?: {}, config?: AxiosRequestConfig) {
    return this.post({ query, variables }, config);
  }

  private post(data: any, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.post("", data, { ...config });
  }

  private transformGQLResponse(res: string) {
    if (res) {
      try {
        const obj = JSON.parse(res) as GraphQLResponse;
        return obj.data;
      } catch (err) {
        throw err;
      }
    }
  }
}
