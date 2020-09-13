import fs from "fs";
import os from "os";
import path from "path";
import { User } from "./interfaces";

export default class Auth {
  get kmdrPathExists() {
    return fs.existsSync(this.kmdrPath);
  }

  get kmdrAuthExists() {
    return fs.existsSync(this.kmdrAuthFullPath);
  }

  get kmdrAuthFullPath() {
    return path.join(this.kmdrPath, this.authFileName);
  }

  public static encodeCredentials(email: string, token: string) {
    return Buffer.from(`${email}:${token}`).toString("base64");
  }

  /**
   * Checks if a string is valid for HTTP Basic Header; 1 non-empty line
   * @param token
   */
  public static isTokenValidFormat(token: string) {
    const trimmedToken = token.trim();
    const lines = trimmedToken.split("\n").length;

    // basic, just check for all spaces, empty or multiline content files
    return trimmedToken !== "" && lines == 1;
  }

  public token: string = "";

  protected readonly kmdrPath: string;
  protected readonly authFileName = "auth";
  protected currentUser?: User;

  constructor(kmdrPath: string) {
    this.kmdrPath = kmdrPath;
    this.read();
  }

  public save(email: string, token: string) {
    const encoded = Auth.encodeCredentials(email, token);

    try {
      if (!this.kmdrPathExists) {
        fs.mkdirSync(this.kmdrPath);
      }

      fs.writeFileSync(this.kmdrAuthFullPath, encoded + +os.EOL, {
        encoding: "ascii",
        mode: 0o600,
      });

      this.token = encoded;
    } catch (err) {
      throw err;
    }
  }

  public read() {
    try {
      this.token = fs.readFileSync(this.kmdrAuthFullPath, "utf8");
    } catch (err) {
      this.token = "";
    }
  }

  public delete() {}
}
