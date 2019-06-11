import Console from '../console';
import {
  ProgramNodeAST,
  SudoNodeAST,
  StickyOptionNodeAST,
  ArgumentNodeAST,
  SubcommandNodeAST,
  OperatorNodeAST,
  OptionNodeAST,
  WordNodeAST,
  OptionWithArgNodeAST,
  Settings,
  FlatTree,
} from '../interfaces';
import Highlight from './highlight';

class Explain extends Console {
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

  public prompt() {
    return super.prompt(this.questions);
  }

  public render(flatTree: FlatTree) {
    const { explainCommand } = flatTree;
    let tokens: string = '';
    explainCommand.forEach((leaf: OptionNodeAST | ProgramNodeAST) => {
      const t = Highlight.decorate(leaf);
      console.log(t);
    });
    console.log(tokens);
  }
}

export default Explain;
