import inquirer from 'inquirer';

class Prompt {
  constructor() {}
  private questions: Array<Object> = [
    {
      type: 'input',
      name: 'query',
      message: 'Explain a command: ',
    },
  ];

  public explain(interactive?: boolean) {
    return inquirer.prompt(this.questions);
  }
}

export default Prompt;
