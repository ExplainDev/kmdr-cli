import fs from "fs";
import fetch from "node-fetch";
import Auth from "../../Auth";
import CLI from "../../Cli";
import { EXIT_STATUS } from "../../constants";
import { KmdrAuthError } from "../../errors";
import Print from "../../Print";

export default class Logout extends CLI {
  constructor() {
    super();
  }

  public async init() {
    try {
      this.spinner?.start("Logging you out...");
      const res = await fetch(`${this.KMDR_ENDPOINT_URI}/logout`, {
        headers: {
          Authorization: `Basic ${this.auth.token}`,
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
          `The session stored ${this.KMDR_AUTH_FILE} is invalid. Manually delete the file and log in again.`,
        );
      }
    } catch (err) {
      if (err instanceof KmdrAuthError) {
        this.spinner?.fail(err.message);
        Print.error("");
        Print.text(`$ rm ${this.KMDR_AUTH_FILE}`);
        Print.error("");
        process.exit(EXIT_STATUS.USER_NOT_AUTHENTICATED);
      } else if (err.code === "ECONNREFUSED") {
        this.spinner?.fail("Could not reach the API registry. Are you connected to the internet?");
        Print.error("");
        Print.error(err);
        Print.error("");
        process.exit(EXIT_STATUS.API_UNREACHABLE);
      }
      this.spinner?.fail(err);
      Print.error("");
      process.exit(EXIT_STATUS.GENERIC);
    }
  }

  protected async hookBeforeLoadingAuth() {
    this.spinner?.start("Reading authentication file...");

    if (!this.kmdrAuthFileExists) {
      this.spinner?.info("You're not logged in to kmdr. Why not log in? ;)");
      Print.text("");
      Print.text("$ kmdr login");
      Print.text("");
      process.exit();
    }
  }

  protected async hookAfterLoadingAuth() {
    if (!Auth.isTokenValidFormat(this.auth.token)) {
      this.spinner?.fail(
        `File ${this.KMDR_AUTH_FILE} is invalid. Manually delete the file and log in again.`,
      );
      Print.error("");
      Print.text(`$ rm ${this.KMDR_AUTH_FILE}`);
      Print.error("");
      process.exit(EXIT_STATUS.FILE_INVALID);
    }
  }
}
