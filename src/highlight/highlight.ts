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
import Decorator from './decorator';

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
    let decoratedString: string = '';
    let currentToken = 0;
    let wordInRange = '';
    let inRange = false;

    for (let pos = 0; pos < query.length; pos++) {
      const char = query[pos];

      if (currentToken < tokens.length && this.inRange(pos, tokens[currentToken].pos)) {
        inRange = true;
        wordInRange += char;

        // if there's a token that spans till the end of the string
        if (pos === query.length - 1) {
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken]);
        }
      } else {
        if (inRange) {
          inRange = false;
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken]);
          wordInRange = '';
          currentToken += 1;
        }
        // if the current char is not part of any token, then append it to the string
        decoratedString += char;
      }
    }

    return decoratedString;
  }

  private inRange(pos: number, range: number[]): boolean {
    const [start, stop] = range;
    if (pos >= start && pos < stop) {
      return true;
    }

    return false;
  }
}

export default Highlight;
