import { AxiosResponse } from "axios";

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
export interface ProgramNode extends NodeAST {
  word: string;
  programName: string;
  isDotSlash?: boolean | null;
  hasPath?: boolean | null;
  schema: ProgramSchema;
}

/**
 * Interface to construct an AssignmentNode
 */
export interface AssignmentNode extends NodeAST {
  word: string;
  name: string;
  name_pos: number[];
  value: string | null;
  value_pos: number[];
}

/**
 * Interface to construct a CommandNode
 */
export interface CommandNode extends NodeAST {
  word: string;
  parts: Array<
    AssignmentNode | WordNode | ProgramNode | SubcommandNode | OptionNode | ArgumentNode
  >;
  inSudoContext?: boolean;
}

export interface CompoundNode extends NodeAST {
  word: string;
  list: Array<ReservedWordNode | ListNode>;
  redirects?: RedirectNode;
}
/**
 * Interface to construct a PipelineNode
 */
export interface PipelineNode extends NodeAST {
  parts: Array<CommandNode | PipeNode>;
}

/**
 * Interface to construct a ListNode
 */
export interface ListNode extends NodeAST {
  parts: Array<CommandNode | OperatorNode>;
}

/**
 * Interface to construct a PipeNode
 */
export interface PipeNode extends NodeAST {
  pipe: string;
}

/**
 * Interface to construct a RedirectNode
 */
export interface RedirectNode extends NodeAST {
  input: number | null;
  output: number | WordNode;
  output_fd: number;
  type: string;
}

/**
 * Interface to construct an OperatorNode
 */
export interface OperatorNode extends NodeAST {
  op: string;
}

/**
 * Interface to construct a ReservedNode
 */
export interface ReservedWordNode extends WordNode {}

/**
 * Interface to construct an ArgumentNode
 */
export interface ArgumentNode extends WordNode {
  arg?: string;
  startsWithDash?: number;
  word: string;
}

/**
 * Interface to construct a WordNode
 */
export interface WordNode extends NodeAST {
  word: string;
}

/**
 * Interface to construct an OptionNode
 */
export interface OptionNode extends WordNode {
  followedByArg?: boolean;
  opt: string;
  optionSchema: OptionSchema;
  optPos: number[];
  startsWithDash?: number;
}

/**
 * Interface to construct an OptionWithNode
 */
export interface OptionWithArgNode extends WordNode {
  word: string;
  option: OptionNode;
  arg: ArgumentNode;
}

/**
 * Interface to construct StickyOptionNode
 */
export interface StickyOptionNode extends WordNode {
  word: string;
  parts?: OptionNode[];
}

/**
 * Interface to construct a SubcommandNode
 */
export interface SubcommandNode extends WordNode {
  schema: ProgramSchema;
}

/**
 * Interface to construct a SudoNode
 */
export interface SudoNode extends WordNode {
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
    Array<OptionNode | ProgramNode | AssignmentNode | SubcommandNode | OperatorNode | PipeNode>
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

export interface ExplainResponse extends AxiosResponse {
  data: ExplainData;
}

interface ExplainData {
  explain: Explain;
}

export interface Explain {
  query: string;
  ast: string;
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

export interface ExplainClientInstance {
  getExplanation(query: string, schema?: string | undefined): Promise<ExplainResponse>;
  getRelatedPrograms(programName: string): Promise<RelatedProgramsResponse>;
  sendFeedback(sessionId: string, answer: string, comment: string): Promise<any>;
}

export interface CommandLeafNodes
  extends Array<ProgramNode | SubcommandNode | AssignmentNode | OptionNode | ArgumentNode> {}

export interface ListLeafNodes
  extends Array<ProgramNode | AssignmentNode | OptionNode | ArgumentNode | OperatorNode> {}

export interface ExplainConfig {
  askOnce: boolean;
  showRelated: boolean;
  showSyntax: boolean;
}

export interface ExplainFeedbackResponse extends AxiosResponse {
  data: ExplainFeedbackData;
}

interface ExplainFeedbackData {
  answer: string;
  comment: string;
}

export interface RelatedProgramsResponse extends AxiosResponse {
  data: RelatedProgramsData;
}

interface RelatedProgramsData {
  relatedPrograms: ProgramSchema[];
}

export interface FlatAST
  extends Array<
    | OptionNode
    | ProgramNode
    | AssignmentNode
    | OperatorNode
    | PipeNode
    | RedirectNode
    | ArgumentNode
    | OptionWithArgNode
    | ReservedWordNode
  > {}
