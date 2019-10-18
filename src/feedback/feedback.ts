import { InputQuestion } from "inquirer";
import Console from "../console";
import FeedbackClient from "./feedbackClient";

export class Feedback {
  private client = new FeedbackClient();
  private console = new Console();

  public async render() {
    const { message, email } = await this.promptFeedback();
    try {
      this.console.startSpinner("Sending your message...");
      const res = await this.client.sendFeedback(message, email);
      if (res.data.createFeedback) {
        this.console.succeedSpinner("Your feedback was saved. Thank you!");
      } else {
        this.console.failSpinner("Your feedback wasn't saved. Please try again.");
      }
    } catch (err) {
      this.console.error(err);
    }
  }

  private promptFeedback(): Promise<any> {
    const question: InputQuestion = [
      {
        message: "How can we help?",
        name: "message",
      },
      {
        message: "Email address:",
        name: "email",
      },
    ];

    return this.console.promptInput(question);
  }
}
