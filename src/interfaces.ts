import { AxiosResponse } from "axios";
import { ProgramSchema } from "kmdr-parser";

export interface Theme {
  node: string;
  attributes: { color: string; style: string };
}

export interface Settings {
  locale: string;
  username: string;
  token: string;
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
  relatedPrograms: ProgramSchema[];
}

export interface ConsoleAnswers {
  [key: string]: string;
}

export interface AuthCredentials {
  username: string;
  token: string;
}

export interface ExplainConfig {
  askOnce: boolean;
  showRelatedPrograms: boolean;
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
  margin?: number;
  appendNewLine?: boolean;
  prependNewLine?: boolean;
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
