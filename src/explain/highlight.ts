import {
  RootNodeAST,
  OptionNodeAST,
  ArgumentNodeAST,
  ProgramNodeAST,
  OperatorNodeAST,
  Theme,
  FlatTree,
  OptionWithArgNodeAST,
  OptionSchema,
  ProgramSchema,
} from '../interfaces';
import AST from './ast';
import chalk from 'chalk';

const HIGHLIGHT_DEFAULTS: any = {
  argument: chalk.italic.white,
  operator: chalk.bold,
  option: chalk.cyan,
  optionWithArg: chalk.cyan,
  pipe: chalk.blueBright,
  program: chalk.bold.blue,
  stickyOption: chalk.cyan,
  subcommand: chalk.bold.magenta,
  sudo: chalk.bgRed.bold.white,
  word: chalk.gray,
};

class Decorator {
  kind: string;
  constructor(kind: string) {
    this.kind = kind;
  }

  decorate(word: string) {
    const { kind } = this;
    console.log(`decorate ${this.kind}`);
    return HIGHLIGHT_DEFAULTS[kind]();
  }
}

class DecorateProgramNode extends Decorator implements ProgramNodeAST {
  word: string;
  programName: string;
  isDotSlash?: boolean | null;
  hasPath?: boolean | null;
  schema?: ProgramSchema | null;
  kind: string;
  pos: number[];

  constructor(node: ProgramNodeAST) {
    super(node.kind);
    this.word = node.word;
    this.programName = node.programName;
    this.isDotSlash = node.isDotSlash;
    this.hasPath = node.hasPath;
    this.schema = node.schema;
    this.kind = node.kind;
    this.pos = node.pos;
  }

  decorate() {
    return super.decorate(this.word);
  }
}

class DecorateArgumentNode extends Decorator implements ArgumentNodeAST {
  word: string;
  startsWithDash?: number;
  kind: string;
  pos: number[];

  constructor(node: ArgumentNodeAST) {
    super(node.kind);
    this.word = node.word;
    this.kind = node.kind;
    this.pos = node.pos;
  }

  decorate() {
    return super.decorate(this.word);
  }
}

class DecorateOptionNode extends Decorator implements OptionNodeAST {
  word: string;
  pos: number[];
  followedByArg?: boolean;
  opt: string;
  optionSchema?: OptionSchema | null;
  optPos: number[];
  startsWithDash?: number;
  kind: string;

  constructor(node: OptionNodeAST) {
    super(node.kind);
    this.kind = node.kind;
    this.pos = node.pos;
    this.word = node.word;
    this.followedByArg = node.followedByArg;
    this.opt = node.opt;
    this.optionSchema = node.optionSchema;
    this.optPos = node.optPos;
    this.startsWithDash = node.startsWithDash;
  }

  decorate() {
    console.log(this.word);
    return super.decorate(this.word);
  }
}

class Highlight {
  static decorate(node: OptionNodeAST | ProgramNodeAST | OptionWithArgNodeAST | ArgumentNodeAST | OperatorNodeAST) {
    if (AST.isOption(node)) {
      const decorateOptionNode = new DecorateOptionNode(<OptionNodeAST>node);
      return decorateOptionNode.decorate();
    }

    if (AST.isProgram(node)) {
      const decorateProgramNode = new DecorateProgramNode(<ProgramNodeAST>node);
      return decorateProgramNode.decorate();
    }

    if (AST.isArgument(node)) {
      const decorateArgumentNode = new DecorateArgumentNode(<ArgumentNodeAST>node);
      return decorateArgumentNode.decorate();
    }
  }
}

export default Highlight;
