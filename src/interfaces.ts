import { AxiosResponse } from "axios";
import { Command, Program } from "kmdr-parser";
import { UserInfo } from "os";

export interface Theme {
  name: string;
  mode?: string;
  palette: ThemePalette;
}

export interface ExplainResponse extends AxiosResponse {
  data: ExplainData;
}

interface ExplainData {
  explain: Explain | null;
}

export interface Explain {
  query: string;
  ast: string;
  examples: Command[];
  relatedPrograms: Program[];
}

export interface ConsoleAnswers {
  [key: string]: string;
}

export interface AuthCredentials {
  username: string;
  token: string;
}

export interface ExplainConfig {
  promptAgain: boolean;
  showRelatedPrograms: boolean;
  showSyntax: boolean;
  showExamples: boolean;
}

export interface ExplainFeedbackResponse extends AxiosResponse {
  data: ExplainFeedbackData;
}

interface ExplainFeedbackData {
  answer: string;
  comment: string;
}

export interface CommandResponse extends AxiosResponse {
  data: CommandData;
}

interface CommandData {
  summary: string;
  command: string;
  totalViews: number;
  createdAt: string;
}

export interface RelatedProgramsResponse extends AxiosResponse {
  data: RelatedProgramsData;
}

interface RelatedProgramsData {
  relatedPrograms: Program[];
}

export interface LatestCliReleaseResponse extends AxiosResponse {
  data: LatestCliReleaseData;
}

interface LatestCliReleaseData {
  latestCliRelease: LatestCliRelease;
}

interface LatestCliRelease {
  isCliVersionCurrent: boolean;
  latestRelease: CliVersion;
}

interface CliVersion {
  url: string;
  body: string;
  tagName: string;
  preRelase: string;
}

export interface ConsolePrintOptions {
  color?: string;
  margin?: number;
  appendNewLine?: boolean;
  prependNewLine?: boolean;
  wrap?: boolean;
}

export interface GraphQLResponse {
  data: any;
}

export interface FeedbackResponse extends AxiosResponse {
  data: FeedbackData;
}

interface FeedbackData {
  createFeedback: Feedback;
}

interface Feedback {
  message: string;
}

export interface LoginIdResponse {
  loginId: string;
}

export interface GetProgramAstResponse {
  getProgramAST: ProgramAst;
}

interface User {
  name: string;
  email: string;
  locale: string;
  username: string;
  location: string;
}

export interface CurrentUserReponse {
  currentUser: User;
}

interface Feedback {
  status: string;
}

export interface SaveFeedbackResponse {
  saveFeedback: Feedback;
}

interface ProgramAst {
  ast: string;
  definitions: string;
  perf?: string;
  sessionId: string;
}

export interface ThemePalette {
  argument: PaletteOptions;
  comment: PaletteOptions;
  keyword: PaletteOptions;
  operator: PaletteOptions;
  option: PaletteOptions;
  program: PaletteOptions;
  subcommand: PaletteOptions;
  [key: string]: PaletteOptions;
}

export interface PaletteOptions {
  background?: string;
  foreground: string;
  underline?: boolean;
  italic?: boolean;
  bold?: boolean;
}

export interface Settings {
  theme: Theme;
}
