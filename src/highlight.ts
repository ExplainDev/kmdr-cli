import { FlatAST } from "kmdr-ast";
import Decorator from "./decorator";

const flatten = (list: any) =>
  list.reduce((a: any, b: any) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

class Highlight {
  public static inRange(pos: number, range: number[]): boolean {
    const [start, stop] = range;

    return pos >= start && pos < stop;
  }

  public decorate(query: string, leafNodes: FlatAST): string {
    let decoratedString: string = "";
    let currentToken = 0;
    let wordInRange = "";
    let inRange = false;
    const tokens = leafNodes;

    for (let pos = 0; pos < query.length; pos++) {
      const char = query[pos];
      if (currentToken < tokens.length && Highlight.inRange(pos, tokens[currentToken].pos)) {
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
}

export default Highlight;
