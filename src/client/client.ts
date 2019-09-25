import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import os from "os";
import uuid from "uuid/v1";
import { AuthCredentials } from "../interfaces";
import Tunnel from 'tunnel';
import Url from 'url';

class Client {
  private baseURL: string = process.env.KMDR_API_URL || "https://api.kmdr.sh/api/graphql";
  private shell: string;
  private term: string;
  private os: string;
  private sessionId: string;
  private instance: AxiosInstance;
  private version: string;

  constructor(version: string, axiosInstance?: AxiosInstance, auth?: AuthCredentials) {
    this.sessionId = uuid();
    this.shell = process.env.SHELL || "";
    this.os = `${os.platform()} ${os.release()}`;
    this.term = `${process.env.TERM};${process.env.TERM_PROGRAM}`;
    this.version = version;
    
    var protocol = this.baseURL.startsWith("https:") ? "https": this.baseURL.startsWith("http:") ? "http" : ""
    var proxyEnv = protocol + "_proxy"
    var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
    var agent : any;
    if (proxyUrl && protocol){
        proxyUrl = proxyUrl.startsWith("http") ? proxyUrl : "http://" + proxyUrl
        var parsedProxyUrl = Url.parse(proxyUrl);
	var tunnel = (protocol === "http") ? Tunnel.httpOverHttp : Tunnel.httpsOverHttp
	var proxy:any = {
	    host: parsedProxyUrl.hostname,
	    port: parsedProxyUrl.port
	}
	if(parsedProxyUrl.auth){
	    var proxyUrlAuth = parsedProxyUrl.auth.split(':');
	    proxy.auth = {
	        username: proxyUrlAuth[0],
	        password: proxyUrlAuth[1]
	    };
        }
	agent = tunnel({
	    proxy:proxy
	    })
	}

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
          "X-kmdr-client-version": this.version,
        },
	responseType: "json",
	httpsAgent : agent,
	proxy : false
      }
    );
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
