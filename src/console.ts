import inquirer from 'inquirer';
import chalk from 'chalk';
import emoji from 'node-emoji';

class Console {
  public prompt(questions: Array<Object>) {
    return inquirer.prompt(questions);
  }
}

export default Console;
