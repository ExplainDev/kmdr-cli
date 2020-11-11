import chalk from "chalk";
import { EACCES } from "constants";
import { prompt } from "enquirer";
import EventSource from "eventsource";
import fs from "fs";
import { ClientError } from "graphql-request";
import fetch from "node-fetch";
import os from "os";
import Auth from "../../Auth";
import CLI from "../../Cli";
import { EXIT_STATUS } from "../../constants";
import KmdrAuthError from "../../errors/KmdrAuthError";
import { CurrentUserReponse, LoginIdResponse, User } from "../../interfaces";
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
  }

  public async init() {
    try {
      const currentUser = await this.getCurrentUser();

      if (currentUser) {
        this.spinner.succeed("You're logged in!");
        Print.newLine();
        this.printUserInfo(currentUser);
        Print.newLine();
        process.exit();
      }

      Print.text("Hi, welcome to kmdr-cli! 👋");
      Print.newLine();

      if (!this.email) {
        Print.text(
          `We use email-based, passwordless authentication. Enter your email address and you will receive a one-time login link`,
        );
        Print.newLine();

        this.email = await this.promptEmail();
      } else {
        Print.text(
          `We use email-based, passwordless authentication. You will receive a one-time login link.`,
        );
      }

      Print.newLine();

      await this.watchLoginEvent();
    } catch (err) {
      if (err instanceof KmdrAuthError) {
        this.spinner.fail(err.message);
        Print.newLine();
        Print.text(`$ rm ${this.KMDR_AUTH_FILE} && kmdr login`);
        Print.newLine();
        process.exit(EXIT_STATUS.USER_NOT_AUTHENTICATED);
      } else if (err.code === "ECONNREFUSED") {
        this.spinner.fail("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
        Print.error("");
        process.exit(EXIT_STATUS.API_UNREACHABLE);
      } else if (err !== "") {
        this.spinner.fail("An error occurred");
        Print.error("");
        Print.error(err);
        Print.error("");
        process.exit(EXIT_STATUS.GENERIC);
      }
    }
  }

  protected async hookAfterLoadingAuth() {
    if (!this.kmdrAuthFileExists) {
      return;
    }

    if (!Auth.isTokenValidFormat(this.auth.token)) {
      this.spinner.fail(`File ${this.KMDR_AUTH_FILE} is invalid. Delete it and try again.`);
      Print.error("");
      Print.error(`$ rm ${this.KMDR_AUTH_FILE} && kmdr login`);
      Print.error("");
      process.exit(EXIT_STATUS.AUTH_FILE_INVALID);
    }
  }

  /**
   * Prints information about the user, e.g. email, username
   *
   * @param user
   */
  protected printUserInfo(user: User) {
    Print.text(`Email: ${user.email}`);

    if (!user.username) {
      Print.text(`Username: You haven't picked a username yet`);
      Print.newLine();
      Print.text(`Complete your registration at ${this.KMDR_WEBAPP_URI}/welcome`);
    } else {
      Print.text(`Username: ${user.username}`);
      Print.newLine();
      Print.text(`Manage your account at ${this.KMDR_WEBAPP_URI}/settings`);
    }
  }

  private async eventSourceMessage(evt: MessageEvent) {
    const { data } = evt;

    switch (data) {
      case "active": {
        try {
          this.auth.save(this.email, this.token);
          this.spinner.succeed("You are now logged in!");

          this.gqlClient.setHeader("authorization", `Basic ${this.auth.token}`);
          const currentUser = await this.getCurrentUser();
          Print.newLine();
          this.printUserInfo(currentUser);
          Print.newLine();
          Print.text("Run `kmdr explain` to get instant command definitions. ");
          Print.newLine();
        } catch (err) {
          this.spinner.fail("An error occurred");
          Print.newLine();
          if (err instanceof KmdrAuthError) {
            Print.error(err.message);
            Print.newLine();
            Print.text(`$ rm ${this.KMDR_AUTH_FILE} && kmdr login`);
            Print.newLine();
            process.exit(EXIT_STATUS.USER_NOT_AUTHENTICATED);
          } else if (err.code === "EACCES") {
            Print.error(`Could not read or create directory ${this.KMDR_PATH}`);
            Print.error(err.message);
            Print.newLine();
            process.exit(EXIT_STATUS.AUTH_PATH_EACCESS);
          }
        }

        this.eventSource.close();
        break;
      }
      case "pending": {
        this.spinner.color = "white";
        this.spinner.spinner = "dots2";
        this.spinner.start(
          `Check your inbox and click on the link provided. The link in your email will be valid for 10 minutes.\n\n  ${chalk.bold(
            "DO NOT close the terminal or exit this program",
          )}\n`,
        );

        break;
      }
      case "expired": {
        this.spinner.fail("The link expired :(");
        Print.newLine();
        this.eventSource.close();
        process.exit(EXIT_STATUS.TOKEN_EXPIRED);
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
          isPro
        }
      }
    `;

    try {
      const data = await this.gqlClient.request<CurrentUserReponse>(gqlQuery);
      return data.currentUser;
    } catch (err) {
      if ((err instanceof ClientError && err.response.status === 401) || err instanceof TypeError) {
        throw new KmdrAuthError(
          `The token in ${this.KMDR_AUTH_FILE} is invalid. Manually delete the file and log in again`,
        );
      }

      throw err;
    }
  }

  private async watchLoginEvent() {
    const { email } = this;

    this.spinner.start("Contacting server...");

    try {
      const res = await fetch(`${this.KMDR_ENDPOINT_URI}/login`, {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          "X-kmdr-origin": "cli",
          "X-kmdr-origin-client-version": this.PKG_VERSION,
        },
        method: "POST",
      });

      if (res.ok) {
        this.spinner.succeed(`Email sent to ${this.email}`);
        Print.newLine();
        const loginResponse: LoginIdResponse = await res.json();

        this.token = loginResponse.loginId;

        this.eventSource = new EventSource(
          `${this.KMDR_ENDPOINT_URI}/login-success?i=${this.token}`,
        );

        this.eventSource.onmessage = this.eventSourceMessage;
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

    let email = "";

    do {
      try {
        const input = await prompt<EmailInput>(inputQuestion);
        const regex = /\S+@\S+\.\S+/;
        if (input.email.trim() === "" || !regex.test(input.email)) {
          Print.error("Enter a valid email. Press Ctrl-c or Esc key to exit.");
        } else {
          email = input.email;
          break;
        }
      } catch (err) {
        throw err;
      }
    } while (true);

    return email;
  }

  // protected pre()
}
