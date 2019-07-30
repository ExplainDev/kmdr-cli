/**
 * Copyright 2019 Eddie Ramirez
 */

/**
 * Interface to construct a RootNodeAST
 */
export interface RootNodeAST {
  query: string;
  length: number;
  trees: NodeAST[];
}

/**
 * Interface to construct a Node
 */
export interface NodeAST {
  kind: string;
  parts?: any;
  pos: number[];
  word?: string;
}
/**
 * Interface to construct a ProgramNode
 */
export interface ProgramNodeAST extends NodeAST {
  word: string;
  programName: string;
  isDotSlash?: boolean | null;
  hasPath?: boolean | null;
  schema: ProgramSchema;
}

/**
 * Interface to construct an AssignmentNode
 */
export interface AssignmentNodeAST extends NodeAST {
  word: string;
  name: string;
  name_pos: number[];
  value: string | null;
  value_pos: number[];
}

/**
 * Interface to construct a CommandNode
 */
export interface CommandNodeAST extends NodeAST {
  word: string;
  parts: Array<
    | AssignmentNodeAST
    | WordNodeAST
    | ProgramNodeAST
    | SubcommandNodeAST
    | OptionNodeAST
    | ArgumentNodeAST
  >;
  inSudoContext?: boolean;
}

export interface CompoundNodeAST extends NodeAST {
  word: string;
  list: Array<ReservedWordNodeAST | ListNodeAST>;
  redirects?: RedirectNodeAST;
}
/**
 * Interface to construct a PipelineNode
 */
export interface PipelineNodeAST extends NodeAST {
  parts: Array<CommandNodeAST | PipeNodeAST>;
}

/**
 * Interface to construct a ListNode
 */
export interface ListNodeAST extends NodeAST {
  parts: Array<CommandNodeAST | OperatorNodeAST>;
}

/**
 * Interface to construct a PipeNode
 */
export interface PipeNodeAST extends NodeAST {
  pipe: string;
}

/**
 * Interface to construct a RedirectNode
 */
export interface RedirectNodeAST extends NodeAST {
  input: number | null;
  output: number | WordNodeAST;
  type: string;
}

/**
 * Interface to construct an OperatorNode
 */
export interface OperatorNodeAST extends NodeAST {
  op: string;
}

/**
 * Interface to construct a ReservedNode
 */
export interface ReservedWordNodeAST extends WordNodeAST {}

/**
 * Interface to construct an ArgumentNode
 */
export interface ArgumentNodeAST extends WordNodeAST {
  arg?: string;
  startsWithDash?: number;
  word: string;
}

/**
 * Interface to construct a WordNode
 */
export interface WordNodeAST extends NodeAST {
  word: string;
}

/**
 * Interface to construct an OptionNode
 */
export interface OptionNodeAST extends WordNodeAST {
  followedByArg?: boolean;
  opt: string;
  optionSchema: OptionSchema;
  optPos: number[];
  startsWithDash?: number;
}

/**
 * Interface to construct an OptionWithNode
 */
export interface OptionWithArgNodeAST extends WordNodeAST {
  word: string;
  option: OptionNodeAST;
  arg: ArgumentNodeAST;
}

/**
 * Interface to construct StickyOptionNode
 */
export interface StickyOptionNodeAST extends WordNodeAST {
  word: string;
  parts?: OptionNodeAST[];
}

/**
 * Interface to construct a SubcommandNode
 */
export interface SubcommandNodeAST extends WordNodeAST {
  schema: ProgramSchema;
}

/**
 * Interface to construct a SudoNode
 */
export interface SudoNodeAST extends WordNodeAST {
  word: string;
  schema: ProgramSchema;
}

/**
 * Interface to construct ProgramSchema object
 */
export interface ProgramSchema {
  args?: ArgumentSchema[];
  description?: string;
  envVars?: EnvVarSchema[];
  link?: string;
  locale?: string;
  manSource?: string;
  manSynopsis?: string;
  name: string;
  optionFormat?: string;
  options?: OptionSchema[];
  patterns?: string[];
  platforms?: string[];
  stickyOptions?: boolean;
  subcommands?: SubcommandSchema[];
  summary?: string;
  version?: string;
}

/**
 * Interface to construct an ArgumentSchema object
 */
export interface ArgumentSchema {
  name: string;
  summary: string;
  description?: string | null;
}

/**
 * Interface to construct a SubcommandSchema object
 */
export interface SubcommandSchema {
  _path?: string[];
  aliases?: string[];
  description?: string;
  name: string;
  options?: OptionSchema[];
  patterns?: string[];
  stickyOptions?: boolean;
  subcommands?: SubcommandSchema[];
  summary?: string;
}

/**
 * Interface to construct an EnvVarSchema object
 */
export interface EnvVarSchema {
  name: string;
  summary: string;
}

/**
 * Interface to construct an OptionSchema object
 */
export interface OptionSchema {
  // argType?: boolean;
  defaultArg?: string | number | boolean;
  description?: string;
  expectsArg?: boolean;
  id?: number;
  long?: string[];
  name?: string;
  section?: string;
  short?: string[];
  source?: string;
  summary: string;
}

export interface Theme {
  node: string;
  attributes: { color: string; style: string };
}

export interface ExplainCommand {
  query: string;
  leafNodes: Array<
    Array<
      | OptionNodeAST
      | ProgramNodeAST
      | AssignmentNodeAST
      | SubcommandNodeAST
      | OperatorNodeAST
      | PipeNodeAST
    >
  >;
}

export interface Settings {
  locale: string;
  username: string;
  token: string;
}

export interface ExplainCommandResponse {
  explainCommand: ExplainCommand;
}

export interface GraphQLResponse {
  data: ExplainCommandResponse;
}

export interface ConsoleAnswers {
  [key: string]: string;
}

export interface AuthCredentials {
  username: string;
  token: string;
}
