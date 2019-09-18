"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const decorator_1 = __importDefault(require("./decorator"));
const flatten = (list) => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);
class Highlight {
    decorate(query, leafNodes) {
        let decoratedString = "";
        let currentToken = 0;
        let wordInRange = "";
        let inRange = false;
        const tokens = leafNodes;
        for (let pos = 0; pos < query.length; pos++) {
            const char = query[pos];
            if (currentToken < tokens.length && this.inRange(pos, tokens[currentToken].pos)) {
                inRange = true;
                wordInRange += char;
                // if there's a token that spans till the end of the string
                if (pos === query.length - 1 || pos === tokens[currentToken].pos[1] - 1) {
                    decoratedString += decorator_1.default.decorate(wordInRange, tokens[currentToken]);
                    inRange = false;
                    wordInRange = "";
                    currentToken += 1;
                }
            }
            else {
                if (inRange) {
                    inRange = false;
                    decoratedString += decorator_1.default.decorate(wordInRange, tokens[currentToken]);
                    wordInRange = "";
                    currentToken += 1;
                }
                // if the current char is not part of any token, then append it to the string
                decoratedString += char;
            }
        }
        return decoratedString;
    }
    inRange(pos, range) {
        const [start, stop] = range;
        if (pos >= start && pos < stop) {
            return true;
        }
        return false;
    }
}
exports.default = Highlight;
//# sourceMappingURL=highlight.js.map