import inquirer from 'inquirer';
import chalk from 'chalk';
import emoji from 'node-emoji';
import logSymbols from 'log-symbols';
import { ConsoleAnswers } from '../interfaces';
import Spinner from 'ora';
import boxen from 'boxen';

class Console {
  private spinner?: any;
  prompt(questions: Array<Object>): Promise<ConsoleAnswers> {
    return inquirer.prompt(questions);
  }

  print(content?: string) {
    console.log(content ? content : '');
  }

  log(str: string) {
    console.log(str);
  }

  clear() {
    console.log('TODO');
  }

  error(msg: string) {
    console.error(logSymbols.error, chalk.bgRedBright(msg));
  }

  showSpinner(msg: string) {
    this.spinner = Spinner(msg).start();
  }

  hideSpinner() {
    this.spinner.stop();
  }

  box(str: string) {
    return boxen(str, { padding: 1, dimBorder: false });
  }
}

export default Console;
