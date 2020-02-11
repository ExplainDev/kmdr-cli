import chalk from "chalk";
import {
  ArgumentNode,
  AssignmentNode,
  OperandNode,
  OperatorNode,
  OptionNode,
  OptionWithArgNode,
  PipeNode,
  ProgramNode,
  RedirectNode,
  SubcommandNode,
  SudoNode,
  WordNode,
} from "kmdr-ast";

const THEMES: any = {
  GreenWay: {
    argument: chalk.italic.bold.whiteBright,
    assignmentName: chalk.green,
    assignmentValue: chalk.whiteBright,
    fileDescriptor: chalk.magenta.bold,
    operand: chalk.white.bold,
    operator: chalk.yellowBright.bold,
    option: chalk.bold.greenBright,
    pipe: chalk.bold.magentaBright,
    program: chalk.bold.cyan,
    redirect: chalk.bold.blueBright,
    reservedword: chalk.bold.gray,
    subcommand: chalk.bold.blue,
    sudo: chalk.bold.redBright,
    word: chalk.bold.white,
  },
};

const DEFAULT_THEME = "GreenWay";

export const decorators: any = {
  argument: (node: ArgumentNode) => {
    const { word } = node;
    return THEMES[DEFAULT_THEME].argument(word);
  },
  assignment: (node: AssignmentNode) => {
    const { name, value } = node;
    const decoratedName = THEMES[DEFAULT_THEME].assignmentName(name);
    const decoratedValue = THEMES[DEFAULT_THEME].assignmentValue(value);

    return `${decoratedName}=${decoratedValue}`;
  },
  fileDescriptor: (str: string) => {
    return THEMES[DEFAULT_THEME].fileDescriptor(str);
  },
  operand: (node: OperandNode) => {
    const { word } = node;
    return THEMES[DEFAULT_THEME].operand(word);
  },
  operator: (node: OperatorNode) => {
    const { op } = node;
    return THEMES[DEFAULT_THEME].operator(op);
  },
  option: (node: OptionNode, fromPropName?: string) => {
    const targetString = fromPropName ? fromPropName : node.word;

    return THEMES[DEFAULT_THEME].option(targetString);
  },

  optionWithArg: (node: OptionWithArgNode) => {
    const { arg, option } = node;
    const decoratedOption = THEMES[DEFAULT_THEME].option(option.word);
    const decoratedArgument = THEMES[DEFAULT_THEME].argument(arg.word);
    return `${decoratedOption}=${decoratedArgument}`;
  },
  pipe: (node: PipeNode) => {
    const { pipe } = node;

    return THEMES[DEFAULT_THEME].pipe(pipe);
  },

  program: (node: ProgramNode) => {
    const { word } = node;

    return THEMES[DEFAULT_THEME].program(word);
  },
  redirect: (node: RedirectNode) => {
    const { input, output, output_fd, type } = node;
    let decoratedNode = "";
    if (input !== null) {
      decoratedNode = THEMES[DEFAULT_THEME].fileDescriptor(input.toString());
    }

    decoratedNode += `\u001b[33;1m${type}\u001b[0m`;

    if (output === null && output_fd) {
      decoratedNode += THEMES[DEFAULT_THEME].fileDescriptor(output_fd.toString());
    } else if (typeof output === "object" && output.kind === "word") {
      decoratedNode += ` ${THEMES[DEFAULT_THEME].word(output.word)}`;
    }
    return decoratedNode;
  },
  subcommand: (node: SubcommandNode) => {
    const { word } = node;

    return THEMES[DEFAULT_THEME].subcommand(word);
  },
  sudo: (node: SudoNode) => {
    const { word } = node;

    return THEMES[DEFAULT_THEME].sudo(word);
  },
  word: (node: WordNode) => {
    const { word } = node;

    return THEMES[DEFAULT_THEME].word(word);
  },
};
