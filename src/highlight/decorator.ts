import chalk from "chalk";
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
  StickyOptionNodeAST,
  SudoNodeAST,
} from "../interfaces";
import AST from "../ast";

const HIGHLIGHT_DEFAULTS: any = {
  argument: chalk.italic.whiteBright,
  assignmentName: chalk.green,
  assignmentValue: chalk.whiteBright,
  operator: chalk.yellowBright.bold,
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
  static decorate(
    word: string,
    token:
      | OptionNodeAST
      | ProgramNodeAST
      | OptionWithArgNodeAST
      | ArgumentNodeAST
      | OperatorNodeAST
      | AssignmentNodeAST
      | PipeNodeAST
      | SudoNodeAST,
  ): string {
    let decoratedString: string;
    if (AST.isAssignment(token)) {
      const assignmentToken = token as AssignmentNodeAST;
      decoratedString = Decorator.color("assignmentName", assignmentToken.name);
      decoratedString += "=";
      decoratedString += Decorator.color("assignmentValue", assignmentToken.value || "");
    } else {
      decoratedString = Decorator.color(token.kind, word);
    }

    return decoratedString;
  }

  static color(kind: string, word: string) {
    return HIGHLIGHT_DEFAULTS[kind](word);
  }
}

export default Decorator;
