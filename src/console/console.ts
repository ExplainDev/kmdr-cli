import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import Spinner from "ora";
import { ConsoleAnswers } from "../interfaces";

class Console {
  private spinner?: any;

  public prompt(questions: object[]): Promise<ConsoleAnswers> {
    return inquirer.prompt(questions);
  }

  public print(content?: string) {
    console.log(content ? content : "");
  }

  public log(str: string) {
    console.log(str);
  }

  public clear() {
    console.log("TODO");
  }

  public error(msg: string) {
    console.log(`thre was an erro`);
    console.error(chalk.bgRedBright(msg));
  }

  public startSpinner(msg: string) {
    this.spinner = Spinner(msg).start();
  }

  public stopSpinner() {
    this.spinner.stop();
  }

  public succeedSpinner(text?: string) {
    this.spinner.succeed(text);
  }

  public box(str: string) {
    return boxen(str, { padding: 1, dimBorder: false });
  }
}

export default Console;
