import fs from "fs";
import { GraphQLClient } from "graphql-request";
import os from "os";
import path from "path";
import DefaultTheme from "./install/themes/greenway.theme.json";
import ThemeManager from "./ThemeManager";

export default abstract class CLI {
  get kmdrDirectoryExists() {
    return fs.existsSync(this.KMDR_PATH);
  }

  get kmdrAuthFileExists() {
    return fs.existsSync(this.KMDR_AUTH_FILE);
  }

  // These values don't change during the execution of the program.
  protected readonly KMDR_ENDPOINT_PROTOCOL: string;
  protected readonly KMDR_ENDPOINT_HOST: string;
  protected readonly KMDR_ENDPOINT_PORT?: number;
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
  protected readonly PKG_VERSION: string;

  protected readonly kmdrAuthCredentials?: string;
  protected httpHeaders: { [key: string]: string } = {};
  protected readonly gqlClient: GraphQLClient;
  protected theme: ThemeManager;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || "development";
    this.OS_PLATFORM = os.platform();
    this.OS_RELEASE = os.release();
    this.OS_SHELL = os.userInfo().shell;
    this.OS_ARCH = os.arch();
    this.OS_HOME_PATH = os.homedir();
    this.NODE_VERSION = process.versions.node;
    this.NODE_PATH = process.env.NODE;
    this.PKG_VERSION = process.env.npm_package_version || "unknown";
    this.LANG = process.env.LANG;
    this.KMDR_PATH = path.join(this.OS_HOME_PATH, ".kmdr");
    this.KMDR_AUTH_FILE = path.join(this.KMDR_PATH, "auth");

    this.theme = new ThemeManager(DefaultTheme);

    if (this.NODE_ENV === "development") {
      this.KMDR_ENDPOINT_PROTOCOL = "http";
      this.KMDR_ENDPOINT_HOST = "localhost";
      this.KMDR_ENDPOINT_PORT = 8081;
    } else {
      this.KMDR_ENDPOINT_PROTOCOL = "https";
      this.KMDR_ENDPOINT_HOST = "stg.api.kmdr.sh";
    }

    this.KMDR_ENDPOINT_URI = `${this.KMDR_ENDPOINT_PROTOCOL}://${this.KMDR_ENDPOINT_HOST}`;

    if (this.KMDR_ENDPOINT_PORT) {
      this.KMDR_ENDPOINT_URI = `${this.KMDR_ENDPOINT_URI}:${this.KMDR_ENDPOINT_PORT}`;
    }

    if (this.kmdrAuthFileExists) {
      this.kmdrAuthCredentials = fs.readFileSync(this.KMDR_AUTH_FILE, "utf8");
    }

    this.gqlClient = new GraphQLClient(`${this.KMDR_ENDPOINT_URI}/api/graphql`, {
      headers: {
        "X-kmdr-origin": "cli",
        authorization: `Basic ${this.kmdrAuthCredentials}`,
      },
    });

    /*
    let settingsFile: SettingsFile | undefined;

    try {
      const filePath = path.join(this.kmdrPath, this.fileName);

      if (!fs.existsSync(filePath)) {
        throw new Error(`File ${filePath} does not exist`);
      } else {
        console.log(`File ${filePath} exists!`);

        const rawFile = fs.readFileSync(filePath, "utf8");

        if (rawFile === "") {
          throw new Error("The file is empty");
        }

        settingsFile = JSON.parse(rawFile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (settingsFile?.email) {
        this.email = settingsFile.email;
      }

      if (settingsFile?.token) {
        this.token = settingsFile.token;
      }

      if (settingsFile?.theme) {
        this.theme = settingsFile.theme;
      }
    }

    const encodedCredentials = Buffer.from(`${settings.email}:${settings.token}`).toString(
      "base64",
    );

    
    */
  }

  // protected gqlClient: GraphQLClient;
  public static(encodedCredentials: string) {
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString();
    return decodedCredentials.split(":");
  }

  public abstract init(): void;
}
