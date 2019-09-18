"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const ast_1 = __importDefault(require("./ast"));
const HIGHLIGHT_DEFAULTS = {
    argument: chalk_1.default.italic.bold.whiteBright,
    assignmentName: chalk_1.default.green,
    assignmentValue: chalk_1.default.whiteBright,
    fileDescriptor: chalk_1.default.magenta.bold,
    operator: chalk_1.default.yellowBright.bold,
    option: chalk_1.default.bold.greenBright,
    optionWithArg: chalk_1.default.cyan,
    pipe: chalk_1.default.bold.magentaBright,
    program: chalk_1.default.bold.cyan,
    redirect: chalk_1.default.bold.blueBright,
    reservedword: chalk_1.default.bold.gray,
    stickyOption: chalk_1.default.cyan,
    subcommand: chalk_1.default.bold.blue,
    sudo: chalk_1.default.bold.redBright,
    word: chalk_1.default.bold.white,
};
class Decorator {
    static decorate(word, token) {
        let decoratedString = "";
        if (ast_1.default.isAssignment(token)) {
            const assignmentToken = token;
            decoratedString = Decorator.color("assignmentName", assignmentToken.name);
            decoratedString += "=";
            decoratedString += Decorator.color("assignmentValue", assignmentToken.value || "");
        }
        else if (ast_1.default.isRedirect(token)) {
            const redirectToken = token;
            const { input, output, output_fd, type } = redirectToken;
            if (input !== null) {
                decoratedString = Decorator.color("fileDescriptor", input.toString());
            }
            decoratedString += Decorator.color("redirect", type);
            if (output === null && output_fd) {
                decoratedString += Decorator.color("fileDescriptor", output_fd.toString());
            }
            else if (typeof output === "object" && output.kind === "word") {
                decoratedString += ` ${Decorator.color("word", output.word)}`;
            }
        }
        else {
            decoratedString = Decorator.color(token.kind, word);
        }
        return decoratedString;
    }
    static color(kind, word) {
        return HIGHLIGHT_DEFAULTS[kind](word);
    }
}
exports.default = Decorator;
//# sourceMappingURL=decorator.js.map