import Console from './console';
import { ConsoleAnswers, ExplainCommandResponse } from '../interfaces';
import Highlight from '../highlight/highlight';
import AST from '../ast';
import {
  OptionNodeAST,
  ProgramNodeAST,
  AssignmentNodeAST,
  SubcommandNodeAST,
  OperatorNodeAST,
  PipeNodeAST,
  StickyOptionNodeAST,
} from '../interfaces';
import Decorator from '../highlight/decorator';
import { program } from '../../node_modules/@types/babel__template';

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

  makeHelp(
    leafNodes: Array<
      | OptionNodeAST
      | ProgramNodeAST
      | AssignmentNodeAST
      | SubcommandNodeAST
      | OperatorNodeAST
      | PipeNodeAST
      | StickyOptionNodeAST
    >,
  ): string {
    let help = '';
    for (const node of leafNodes) {
      if (AST.isProgram(node)) {
        const programNode = <ProgramNodeAST>node;
        const { summary, name } = programNode.schema;
        const decoratedProgramName = Decorator.decorate(name, programNode);
        help += `${decoratedProgramName} (program)\n`;
        help += `  ${summary}\n`;
      }

      if (AST.isOption(node)) {
        const optionNode = <OptionNodeAST>node;
        const { summary, long, short } = optionNode.optionSchema;
        let decoratedOptions = [];

        if (short) {
          decoratedOptions.push(Decorator.decorate(short.join(', '), optionNode));
        }

        if (long) {
          decoratedOptions.push(Decorator.decorate(long.join(', '), optionNode));
        }

        help += `  ${decoratedOptions.join(', ')} (option)\n`;
        help += `    ${summary}\n`;
      }

      if (AST.isSubcommand(node)) {
        const subcommandNode = <SubcommandNodeAST>node;
        const { name, summary } = subcommandNode.schema;
        const decoratedSubcommandName = Decorator.decorate(name, subcommandNode);
        help += `${decoratedSubcommandName} (subcommand)\n`;
        help += `  ${summary}\n`;
      }

      if (AST.isAssignment(node)) {
        const assignmentNode = <AssignmentNodeAST>node;
        const { name, value, word } = assignmentNode;
        const decoratedAssignment = Decorator.decorate(word, assignmentNode);
        help += `${decoratedAssignment} (variable)\n`;
        help += `  A variable that is passed to the program\n`;
      }

      if (AST.isOperator(node)) {
        const operatorNode = <OperatorNodeAST>node;
        const { op } = operatorNode;
        const decoratedOperator = Decorator.decorate(op, operatorNode);
        help += `${decoratedOperator} (operator)\n`;
        if (op === '&&') {
          help += `  command2 is executed if, and only if, command1 returns an exit status of zero\n`;
        } else if (op === '||') {
          help += `  command2  is  executed  if and only if command1 returns a non-zero exit status\n`;
        }
      }
    }

    return help;
  }

  prompt(): Promise<ConsoleAnswers> {
    return super.prompt(this.questions);
  }

  error(msg: string) {
    super.error(msg);
  }

  render(data: ExplainCommandResponse) {
    const { query, leafNodes } = data.explainCommand;
    if (leafNodes) {
      const highlight = new Highlight();
      const decoratedString = highlight.decorate(query, leafNodes);
      this.print(super.box(decoratedString));
      const help = this.makeHelp(leafNodes);
      this.print(help);
    } else {
      this.error('No result');
    }
  }

  showSpinner(msg: string) {
    super.showSpinner(msg);
  }
}

export default ExplainConsole;
