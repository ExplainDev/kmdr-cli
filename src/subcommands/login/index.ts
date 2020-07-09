import { prompt } from "enquirer";
import EventSource from "eventsource";
import fs from "fs";
import fetch from "node-fetch";
import CLI from "../../cli";
import { LoginIdResponse, CurrentUserReponse } from "../../interfaces";
import Print from "../../Print";
import KmdrError from "../../errors/KmdrError";
import KmdrAuthError from "../../errors/KmdrAuthError";

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
        const currentUser = await this.getCurrentUser();
        Print.text("You're logged in!");
        Print.newLine();
        Print.text(`Email: ${currentUser?.email}`);
        Print.text(`Username: ${currentUser.username || "You haven't picked a username"}`);

        Print.newLine();

        Print.text("Run `kmdr logout` to log out from this system");
        Print.newLine();
      } else if (this.email) {
        await this.watchLoginEvent(this.email);
      } else {
        this.email = await this.promptEmail();
        await this.watchLoginEvent(this.email);
      }
    } catch (err) {
      if (err instanceof KmdrAuthError) {
        if (err.code === 5) {
          Print.error(err.message);
        }
      }
    }
  }

  protected saveAuthToDisk(email: string, token: string) {
    const encodedCredentials = Buffer.from(`${email}:${token}`).toString("base64");

    console.log(encodedCredentials);

    try {
      fs.writeFileSync(this.KMDR_AUTH_FILE, encodedCredentials);
    } catch (err) {
      throw err;
    }
  }

  private async eventSourceMessage(evt: MessageEvent) {
    const { data } = evt;

    switch (data) {
      case "active": {
        this.saveAuthToDisk(this.email, this.token);
        console.log("Saved!");
        this.eventSource.close();
        break;
      }
      case "pending": {
        break;
      }
      case "expired": {
        this.eventSource.close();
        break;
      }
      case "logout": {
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
      if (err.response.status === 401) {
        throw new KmdrAuthError(
          `The login is invalid. Please manually delete file ${this.KMDR_AUTH_FILE} and login again`,
        );
      }
      throw err;
    }
  }

  private async watchLoginEvent(email: string) {
    try {
      const res = await fetch("http://localhost:8081/login", {
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
          this.eventSource = new EventSource(`http://localhost:8081/login-success?i=${this.token}`);
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
          console.error("Enter a valid email");
        } else {
          return input.email;
        }
      } catch (err) {
        throw err;
      }
    } while (true);
  }
}
