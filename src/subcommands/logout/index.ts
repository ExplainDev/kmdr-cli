import fs from "fs";
import fetch from "node-fetch";
import CLI from "../../cli";
import { KmdrAuthError } from "../../errors";
import Print from "../../Print";

export default class Logout extends CLI {
  constructor() {
    super();
  }

  public async init() {
    if (!this.kmdrDirectoryExists) {
      Print.error(`The directory ${this.KMDR_PATH} does not exist`);
      Print.newLine();
      return;
    } else if (!this.kmdrAuthFileExists || !this.kmdrAuthCredentials) {
      Print.error(`Could not log out because you're not logged in`);
      Print.newLine();
      return;
    }

    try {
      const res = await fetch(`${this.KMDR_ENDPOINT_URI}/logout`, {
        headers: {
          Authorization: `Basic ${this.kmdrAuthCredentials}`,
          "X-kmdr-origin": "cli",
        },
        method: "POST",
      });
      if (res.ok) {
        fs.unlinkSync(this.KMDR_AUTH_FILE);
        Print.text("You're logged out!");
        Print.newLine();
      } else {
        throw new KmdrAuthError(
          `The session stored in this machine is invalid. Delete file ${this.KMDR_AUTH_FILE} and log in again`,
        );
      }
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        Print.error("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
      } else {
        Print.error(err);
      }
      Print.newLine();
    }
  }
}
