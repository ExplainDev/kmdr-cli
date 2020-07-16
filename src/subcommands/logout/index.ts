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
    this.spinner?.start();

    if (!this.kmdrDirectoryExists) {
      this.spinner?.fail(`The directory ${this.KMDR_PATH} does not exist`);
      Print.newLine();
      return;
    } else if (!this.kmdrAuthFileExists || !this.kmdrAuthCredentials) {
      this.spinner?.fail(`Could not log out because you're not logged in`);
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
        this.spinner?.succeed("You were logged out successfully!");
        Print.newLine();
      } else {
        throw new KmdrAuthError(
          `The session stored in this machine is invalid. Delete file ${this.KMDR_AUTH_FILE} and log in again`,
        );
      }
    } catch (err) {
      if (err.code === "ECONNREFUSED") {
        this.spinner?.fail("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
      } else {
        this.spinner?.fail(err);
      }
      Print.newLine();
    }
  }
}
