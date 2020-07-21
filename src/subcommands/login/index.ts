import chalk from "chalk";
import { prompt } from "enquirer";
import EventSource from "eventsource";
import fs from "fs";
import { ClientError } from "graphql-request";
import fetch from "node-fetch";
import os from "os";
import CLI from "../../Cli";
import KmdrAuthError from "../../errors/KmdrAuthError";
import { CurrentUserReponse, LoginIdResponse } from "../../interfaces";
import Print from "../../Print";

interface EmailInput {
  email: string;
}

export default class Login extends CLI {
  private email!: string;
  private token!: string;
  private eventSource!: EventSource;

  constructor(email?: string) {
    super();

    if (email) {
      this.email = email;
    }

    this.eventSourceMessage = this.eventSourceMessage.bind(this);
    this.saveAuthToDisk = this.saveAuthToDisk.bind(this);
  }

  public async init() {
    try {
      if (this.kmdrAuthFileExists) {
        this.spinner?.start("Validating your stored session...");
        const currentUser = await this.getCurrentUser();

        if (!currentUser) {
          throw new KmdrAuthError(
            `The session stored in this machine is invalid. Delete file ${this.KMDR_AUTH_FILE} and log in again`,
          );
        }
        this.spinner?.succeed("You're logged in!");

        Print.newLine();
        Print.text(`Email: ${currentUser?.email}`);
        Print.text(`Username: ${currentUser.username || "You haven't picked a username"}`);

        Print.newLine();

        Print.text("Run `kmdr logout` to log out from this system");
        Print.newLine();
      } else {
        if (!this.email) {
          this.email = await this.promptEmail();
        }
        // spinner.start("")
        await this.watchLoginEvent();
      }
    } catch (err) {
      // spinner.fail("An error occured!");
      if (err instanceof KmdrAuthError) {
        this.spinner?.fail(err.message);
      } else if (err.code === "ECONNREFUSED") {
        this.spinner?.fail("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
      } else {
        this.spinner?.fail("An error occurred");
        Print.error(err);
      }
      Print.newLine();
    }
  }

  protected saveAuthToDisk(email: string, token: string) {
    const encodedCredentials = Buffer.from(`${email}:${token}`).toString("base64");

    try {
      if (!this.kmdrDirectoryExists) {
        fs.mkdirSync(this.KMDR_PATH);
      }
      fs.writeFileSync(this.KMDR_AUTH_FILE, encodedCredentials + +os.EOL, {
        encoding: "ascii",
        mode: 0o600,
      });
    } catch (err) {
      throw err;
    }
  }

  private async eventSourceMessage(evt: MessageEvent) {
    const { data } = evt;

    switch (data) {
      case "active": {
        try {
          this.saveAuthToDisk(this.email, this.token);
          this.spinner?.succeed("You are now logged in!");
          Print.newLine();
          Print.text("Try `kmdr explain` to get instant command definitions. ");
          Print.newLine();
        } catch (err) {
          this.spinner?.fail("An error occurred");
          Print.error(`Could not read or create directory ${this.KMDR_PATH}`);
          Print.newLine();
        }

        this.eventSource.close();
        break;
      }
      case "pending": {
        this.spinner?.start(
          `Check your inbox and click on the link provided in the email.\n\n  ${chalk.bold(
            "DO NOT close the terminal or exit this program",
          )}\n`,
        );

        break;
      }
      case "expired": {
        this.spinner?.fail("The link expired");
        Print.newLine();
        this.eventSource.close();
        break;
      }
      case "logout": {
        this.spinner?.fail("You're logged out.");
        Print.newLine();
        this.eventSource.close();
        break;
      }
    }
  }

  private async getCurrentUser() {
    const gqlQuery = /* GraphQL */ `
      query currentUser {
        currentUser {
          username
          email
          name
          location
          locale
        }
      }
    `;

    try {
      const data = await this.gqlClient.request<CurrentUserReponse>(gqlQuery);
      return data.currentUser;
    } catch (err) {
      if (err instanceof ClientError && err.response.status === 401) {
        throw new KmdrAuthError(
          `The login is invalid. Please manually delete file ${this.KMDR_AUTH_FILE} and login again`,
        );
      }
      throw err;
    }
  }

  private async watchLoginEvent() {
    try {
      const { email } = this;
      this.spinner?.start();
      const res = await fetch(`${this.KMDR_ENDPOINT_URI}/login`, {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          "X-kmdr-origin": "cli",
        },
        method: "POST",
      });

      if (res.ok) {
        const loginResponse: LoginIdResponse = await res.json();

        if (loginResponse) {
          this.token = loginResponse.loginId;
          this.eventSource = new EventSource(
            `${this.KMDR_ENDPOINT_URI}/login-success?i=${this.token}`,
          );
          this.eventSource.onmessage = this.eventSourceMessage;
        }
      } else {
        throw new Error("Error");
      }
    } catch (err) {
      throw err;
    }
  }

  private async promptEmail() {
    const inputQuestion = {
      message: "Email",
      name: "email",
      type: "input",
    };

    do {
      try {
        const input = await prompt<EmailInput>(inputQuestion);
        if (input.email.trim() === "") {
          Print.error("Enter a valid email");
        } else {
          return input.email;
        }
      } catch (err) {
        throw err;
      }
    } while (true);
  }
}
