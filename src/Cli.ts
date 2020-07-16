import fs from "fs";
import { GraphQLClient } from "graphql-request";
import ora from "ora";
import os from "os";
import path from "path";
import pkg from "../package.json";
import SettingsManager from "./SettingsManager";

export default abstract class CLI {
  get kmdrDirectoryExists() {
    return fs.existsSync(this.KMDR_PATH);
  }

  get kmdrAuthFileExists() {
    return fs.existsSync(this.KMDR_AUTH_FILE);
  }

  public spinner?: ora.Ora = ora("Loading...");

  // These values don't change during the execution of the program.
  protected readonly KMDR_ENDPOINT_URI: string;
  protected readonly KMDR_PATH: string;
  protected readonly KMDR_AUTH_FILE: string;
  protected readonly LANG?: string;
  protected readonly NODE_ENV: string;
  protected readonly NODE_PATH?: string;
  protected readonly NODE_VERSION: string;
  protected readonly OS_ARCH: string;
  protected readonly OS_HOME_PATH: string;
  protected readonly OS_PLATFORM: string;
  protected readonly OS_RELEASE: string;
  protected readonly OS_SHELL: string;
  protected readonly OS_USERNAME: string;
  protected readonly PKG_VERSION: string;

  protected readonly kmdrAuthCredentials?: string;
  protected httpHeaders: { [key: string]: string } = {};
  protected readonly gqlClient: GraphQLClient;
  protected settingsManager: SettingsManager;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "production";
    this.OS_PLATFORM = os.platform();
    this.OS_RELEASE = os.release();
    this.OS_SHELL = os.userInfo().shell;
    this.OS_ARCH = os.arch();
    this.OS_HOME_PATH = os.homedir();
    this.OS_USERNAME = os.userInfo().username;
    this.NODE_VERSION = process.versions.node;
    this.NODE_PATH = process.env.NODE;
    this.PKG_VERSION = pkg.version || "unknown";
    this.LANG = process.env.LANG;
    this.KMDR_PATH = path.join(this.OS_HOME_PATH, ".kmdr");
    this.KMDR_AUTH_FILE = path.join(this.KMDR_PATH, "auth");

    this.settingsManager = new SettingsManager(this.KMDR_PATH);

    this.KMDR_ENDPOINT_URI = process.env.KMDR_API_ENDPOINT || "https://stg.api.kmdr.sh";

    if (this.kmdrAuthFileExists) {
      this.kmdrAuthCredentials = fs.readFileSync(this.KMDR_AUTH_FILE, "utf8");
    }

    this.gqlClient = new GraphQLClient(`${this.KMDR_ENDPOINT_URI}/api/graphql`, {
      headers: {
        "X-kmdr-origin": "cli",
        authorization: `Basic ${this.kmdrAuthCredentials}`,
      },
    });
  }

  // protected gqlClient: GraphQLClient;
  public static(encodedCredentials: string) {
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString();
    return decodedCredentials.split(":");
  }

  public abstract init(): void;
}
