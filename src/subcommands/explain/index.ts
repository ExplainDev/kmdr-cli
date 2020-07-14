import { parse } from "commander";
import { prompt } from "enquirer";
import { Highlight, NodeDefinition, Tree } from "kmdr-ast";
import CLI from "../../Cli";
import CliDecorators from "../../CliDecorators";
import { KmdrAuthError } from "../../errors";
import { GetProgramAstResponse, SaveFeedbackResponse } from "../../interfaces";
import Print from "../../Print";
import util from "util";
import chalk from "chalk";
import { ClientError } from "graphql-request";

interface ExplainInputQuery {
  source: string;
}

interface NextActionAnswer {
  action: string;
}

interface FeedbackAnswer {
  feedback: string;
}

export default class Explain extends CLI {
  private decorators: CliDecorators;

  constructor() {
    super();
    this.decorators = new CliDecorators(this.theme);
  }

  public async init() {
    let repeat = false;

    try {
      do {
        const rawSource = await this.promptSource();
        const trimmedSource = rawSource.trim();

        if (trimmedSource === "") {
          Print.error("Enter a non-empty query");
          Print.newLine();
          repeat = true;
          continue;
        }
        // Print a new line after prompting the user
        Print.newLine();

        const programAst = await this.getProgramAST(trimmedSource);

        const { ast, definitions, perf, sessionId } = programAst;
        const parsedAST = JSON.parse(ast);
        const tree = new Tree(parsedAST);
        const parsedDefinitions: NodeDefinition[] = JSON.parse(definitions);
        const highlight = new Highlight<string>(this.decorators, "cli");
        const decoratedNodes = highlight.source(trimmedSource, tree, parsedDefinitions);
        const decoratedString = decoratedNodes.join("");

        // Syntax highlighting
        Print.text(decoratedString, 4);
        Print.newLine();

        Print.header("Definitions");
        Print.newLine();

        if (parsedDefinitions.length === 0) {
          Print.error("Could not find any definitions in your command");
        }

        for (const def of parsedDefinitions) {
          const [header, summary] = this.decorators.createDefinition(def);
          Print.text(header, 4);
          Print.text(summary, 6);
        }

        Print.newLine();

        // what do you want to do next?
        const action = await this.promptNextAction();

        switch (action) {
          case "ask": {
            repeat = true;
            break;
          }
          case "feedback": {
            const answer = await this.promptFeedback();
            const status = await this.saveFeedback(answer, sessionId);

            if (status) {
              console.log("Success");
            } else {
              console.error("An error");
            }
            repeat = true;
            break;
          }
          case "exit": {
            repeat = false;
            break;
          }
        }
      } while (repeat);
    } catch (err) {
      if (err instanceof KmdrAuthError) {
        Print.error(err.message);
        Print.newLine();
      } else if (err.code === "ECONNREFUSED") {
        Print.error("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
      }
      Print.newLine();
    }
  }

  private async getProgramAST(source: string) {
    const gqlQuery = /* GraphQL */ `
      query getProgramAST($source: String!, $locale: String, $url: String, $title: String) {
        getProgramAST(source: $source, locale: $locale, url: $url, title: $title) {
          ast
          definitions
          perf
          sessionId
        }
      }
    `;

    try {
      const data = await this.gqlClient.request<GetProgramAstResponse>(gqlQuery, { source });
      return data.getProgramAST;
    } catch (err) {
      if (err instanceof ClientError && err.response.status === 401) {
        throw new KmdrAuthError("You are not logged in. Run `kmdr login` to sign in.");
      } else {
        throw err;
      }
    }
  }

  private async saveFeedback(answer: string, sessionId: string) {
    const gqlMutation = `
    mutation saveFeedback($answer: String!, $sessionId: String!) {
      saveFeedback(answer: $answer, sessionId: $sessionId) {
        status
      }
    }`;

    try {
      const data = await this.gqlClient.request<SaveFeedbackResponse>(gqlMutation, {
        answer,
        sessionId,
      });
      return data.saveFeedback;
    } catch (err) {
      throw err;
    }
  }

  private async promptFeedback() {
    const feedbackQuestions = {
      choices: [
        { message: "Yes", value: "yes" },
        { message: "No", value: "no" },
      ],
      message: "Was this helpful?",
      name: "feedback",
      type: "select",
    };
    try {
      const answer = await prompt<FeedbackAnswer>(feedbackQuestions);
      return answer.feedback;
    } catch (err) {
      throw err;
    }
  }

  private async promptNextAction() {
    const nextQuestions = {
      choices: [
        {
          message: "Explain more commands",
          value: "ask",
        },
        { message: "Was this helpful?", value: "feedback" },
        { role: "separator" },
        { message: "Exit (or press Ctrl+c)", value: "exit" },
      ],
      message: "What do you want to do?",
      name: "action",
      type: "select",
    };
    try {
      const answer = await prompt<NextActionAnswer>(nextQuestions);
      return answer.action;
    } catch (err) {
      throw err;
    }
  }

  private async promptSource() {
    const inputQuestion = {
      message: "Enter your command",
      name: "source",
      type: "input",
    };

    try {
      const input = await prompt<ExplainInputQuery>(inputQuestion);
      return input.source;
    } catch (err) {
      throw err;
    }
  }
}
