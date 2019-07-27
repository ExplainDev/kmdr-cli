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
  ReservedWordNodeAST,
  RedirectNodeAST,
} from "../interfaces";
import AST from "../ast";

const HIGHLIGHT_DEFAULTS: any = {
  argument: chalk.italic.bold.whiteBright,
  assignmentName: chalk.green,
  assignmentValue: chalk.whiteBright,
  operator: chalk.yellowBright.bold,
  option: chalk.bold.greenBright,
  optionWithArg: chalk.cyan,
  pipe: chalk.bold.magentaBright,
  program: chalk.bold.cyan,
  redirect: chalk.bold.blueBright,
  reservedword: chalk.bold.gray,
  stickyOption: chalk.cyan,
  subcommand: chalk.bold.blue,
  sudo: chalk.bold.redBright,
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
      | SudoNodeAST
      | ReservedWordNodeAST
      | RedirectNodeAST,
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
