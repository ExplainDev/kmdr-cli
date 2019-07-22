import Decorator from "./decorator";

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
  ReservedWordNodeAST,
  PipeNodeAST,
  RedirectNodeAST,
} from "../interfaces";

class Highlight {
  public decorate(
    query: string,
    leafNodes: Array<
      Array<
        | OptionNodeAST
        | ProgramNodeAST
        | OptionWithArgNodeAST
        | ArgumentNodeAST
        | OperatorNodeAST
        | AssignmentNodeAST
        | PipeNodeAST
        | ReservedWordNodeAST
        | RedirectNodeAST
      >
    >,
  ): string {
    let decoratedString: string = "";
    let currentToken = 0;
    let wordInRange = "";
    let inRange = false;
    const tokens = leafNodes.flat();

    for (let pos = 0; pos < query.length; pos++) {
      const char = query[pos];
      if (currentToken < tokens.length && this.inRange(pos, tokens[currentToken].pos)) {
        inRange = true;
        wordInRange += char;
        // if there's a token that spans till the end of the string
        if (pos === query.length - 1 || pos === tokens[currentToken].pos[1] - 1) {
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken]);
          inRange = false;
          wordInRange = "";
          currentToken += 1;
        }
      } else {
        if (inRange) {
          inRange = false;
          decoratedString += Decorator.decorate(wordInRange, tokens[currentToken]);
          wordInRange = "";
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
