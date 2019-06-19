import Console from './console';
import { ConsoleAnswers, ExplainCommandResponse } from '../interfaces';
import Highlight from '../highlight/highlight';

class ExplainConsole extends Console {
  private questions: Array<Object> = [
    {
      type: 'input',
      name: 'query',
      message: 'Explain a command:',
    },
  ];

  constructor() {
    super();
  }

  prompt(): Promise<ConsoleAnswers> {
    return super.prompt(this.questions);
  }

  error(msg: string) {
    super.error(msg);
  }

  render(data: ExplainCommandResponse) {
    console.log();
    const { query, leafNodes } = data.explainCommand;
    if (leafNodes) {
      const highlight = new Highlight();
      const decoratedString = highlight.decorate(query, leafNodes);
      this.print(super.box(decoratedString));
      this.help(leafNodes);
    } else {
      this.error('No result');
    }
  }

  showSpinner(msg: string) {
    super.showSpinner(msg);
  }
}

export default ExplainConsole;
