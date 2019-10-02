import chalk from "chalk";
import inquirer, { InputQuestion, ListQuestion } from "inquirer";
import Spinner from "ora";

export default class Console {
  private spinner?: any;

  public async prompt(questions: any): Promise<any> {
    return inquirer.prompt(questions);
  }

  public async promptInput(questions: InputQuestion): Promise<any> {
    return inquirer.prompt(questions);
  }

  public async promptList(questions: ListQuestion) {
    return inquirer.prompt(questions);
  }

  public print(content: string = "", leftSpaces: number = 0) {
    console.log(`${" ".repeat(leftSpaces)}${content}`);
  }

  public log(str: string) {
    console.log(str);
  }

  public clear() {
    console.log("TODO");
  }

  public error(msg: string) {
    console.error(chalk.red(msg));
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

  public printWithIcon(title: string, icon: string) {
    console.log(`${icon} ${title}`);
  }

  public printTitle(title: string, offset = 2) {
    const styledTitle = chalk.bold.whiteBright(title);
    const spaces = " ".repeat(offset);
    console.log(`${spaces}${styledTitle}`);
    console.log();
  }
}
