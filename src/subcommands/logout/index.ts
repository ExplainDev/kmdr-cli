import fs from "fs";
import fetch from "node-fetch";
import CLI from "../../cli";

export default class Logout extends CLI {
  constructor() {
    super();
  }

  public async init() {
    if (!this.kmdrDirectoryExists) {
      console.error(`The directory ${this.KMDR_PATH} does not exist`);
      return;
    } else if (!this.kmdrAuthFileExists || !this.kmdrAuthCredentials) {
      console.error(`Could not log out because you're not logged in`);
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
        console.log("You're logged out!");
      } else {
        console.error("An error occured. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
