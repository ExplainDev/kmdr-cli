import {
  RootNodeAST,
  OptionNodeAST,
  ArgumentNodeAST,
  ProgramNodeAST,
  OperatorNodeAST,
  Theme,
  ExplainCommand,
  OptionWithArgNodeAST,
  OptionSchema,
  ProgramSchema,
  AssignmentNodeAST,
  PipeNodeAST,
} from '../interfaces';
import chalk from 'chalk';

const HIGHLIGHT_DEFAULTS: any = {
  argument: chalk.italic.whiteBright,
  operator: chalk.bold,
  option: chalk.bold.cyan,
  optionWithArg: chalk.cyan,
  pipe: chalk.blueBright,
  program: chalk.bold.redBright,
  stickyOption: chalk.cyan,
  subcommand: chalk.bold.magenta,
  sudo: chalk.bgRed.bold,
  word: chalk.gray,
};

class Decorator {
  static decorate(word: string, kind: string): string {
    return HIGHLIGHT_DEFAULTS[kind](word);
  }
}

class Highlight {
  decorate(
    query: string,
    tokens: Array<
      | OptionNodeAST
      | ProgramNodeAST
      | OptionWithArgNodeAST
      | ArgumentNodeAST
      | OperatorNodeAST
      | AssignmentNodeAST
      | PipeNodeAST
    >,
  ): string {
    console.log(query);
    let decoratedString: string = '';
    let currentToken = 0;
    let wordInRange = '';
    let inRange = false;
    for (let pos = 0; pos < query.length; pos++) {
      const char = query[pos];
      console.log(`char at pos ${pos} = ${char} ${currentToken}`);
      if (currentToken < tokens.length && this.inRange(pos, tokens[currentToken].pos)) {
        inRange = true;
        wordInRange += char;
        if (pos === query.length - 1) {
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken].kind);
        }
      } else {
        if (inRange) {
          inRange = false;
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken].kind);
          wordInRange = '';
          currentToken += 1;
        }
        decoratedString += char;
      }
    }
    return decoratedString;
  }
  /* 
  private decorateAtPos(text: string, pos: number[], kind: string): string {
    const [start, stop] = pos;

    const oldString = text.substring(start, stop);
    const newString = Decorator.decorate(kind, oldString);
    return text.substring(0, start) + newString + text.substring(stop);
  } */

  private inRange(pos: number, range: number[]): boolean {
    const [start, stop] = range;
    if (pos >= start && pos < stop) {
      return true;
    }

    return false;
  }
}

export default Highlight;
