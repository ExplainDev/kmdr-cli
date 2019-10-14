import chalk from "chalk";
import inquirer, { InputQuestion, ListQuestion } from "inquirer";
import Spinner from "ora";
import { ConsolePrintOptions } from "./interfaces";

export default class Console {
  private spinner?: any;
  private defaultPrintOptions: ConsolePrintOptions = {
    appendNewLine: true,
    margin: 2,
    prependNewLine: false,
  };

  public async prompt(questions: any): Promise<any> {
    return inquirer.prompt(questions);
  }

  public async promptInput(questions: InputQuestion): Promise<any> {
    return inquirer.prompt(questions);
  }

  public async promptList(questions: ListQuestion) {
    return inquirer.prompt(questions);
  }

  public log(str: string) {
    console.log(str);
  }

  public clear() {
    console.clear();
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

  public printTitle(title: string, options = this.defaultPrintOptions) {
    const styledTitle = chalk.bold.whiteBright(title);
    this.print(styledTitle, options);
  }

  public print(msg: string, options = this.defaultPrintOptions) {
    let { margin, prependNewLine, appendNewLine } = options;

    if (margin === undefined) {
      margin = 2;
    }

    const spaces = " ".repeat(margin ? margin : 0);

    if (prependNewLine === true) {
      console.log();
    }

    console.log(`${spaces}${msg}`);

    if (appendNewLine === true) {
      console.log();
    }
  }

  public render() {
    return;
  }
}
