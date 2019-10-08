import chalk from "chalk";
import inquirer, { InputQuestion, ListQuestion } from "inquirer";
import Spinner from "ora";
import { ConsolePrintOptions } from "./interfaces";
import { prependListener } from "cluster";

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

  public printTitle(title: string, options: ConsolePrintOptions = this.defaultPrintOptions) {
    const styledTitle = chalk.bold.whiteBright(title);

    this.print(styledTitle, options);
  }

  public print(msg: string, options: ConsolePrintOptions = this.defaultPrintOptions) {
    const { margin, prependNewLine, appendNewLine } = options;
    const spaces = " ".repeat(margin ? margin : 0);

    if (prependListener) {
      console.log();
    }

    console.log(`${spaces}${msg}`);

    if (appendNewLine) {
      console.log();
    }
  }

  public render() {
    return;
  }
}
