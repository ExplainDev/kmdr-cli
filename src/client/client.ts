import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Agent } from "http";
import os from "os";
import Tunnel, { ProxyOptions } from "tunnel";
import Url from "url";
import uuid from "uuid/v1";

class Client {
  private baseURL: string = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
  private shell: string;
  private term: string;
  private os: string;
  private sessionId: string;
  private instance: AxiosInstance;
  private version: string;
  private isHttps: boolean;

  constructor(version: string, axiosInstance?: AxiosInstance) {
    this.sessionId = uuid();
    this.shell = process.env.SHELL || "";
    this.os = `${os.platform()} ${os.release()}`;
    this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
    this.version = version;
    this.isHttps = this.baseURL.startsWith("https:");

    const axiosConfig: AxiosRequestConfig = {
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
        "X-kmdr-client-os": this.os,
        "X-kmdr-client-session-id": this.sessionId,
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
    return this.post({ query, variables }, config);
  }

  protected doMutation(query: string, variables?: {}) {
    return this.post({ query, variables });
  }

  private post(data: any, config?: AxiosRequestConfig) {
    return this.instance.post("", data, { ...config });
  }
}

export default Client;
