import { prompt } from "enquirer";
import { ClientError } from "graphql-request";
import { Highlight, NodeDefinition, Tree } from "kmdr-ast";
import Auth from "../../Auth";
import CLI from "../../Cli";
import CliDecorators from "../../CliDecorators";
import { EXIT_STATUS } from "../../constants";
import { KmdrAuthError } from "../../errors";
import { GetProgramAstResponse, SaveFeedbackResponse } from "../../interfaces";
import Print from "../../Print";

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
    this.decorators = new CliDecorators(this.settingsManager.theme);
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
        this.spinner?.start("Analyzing the command...");
        const programAst = await this.getProgramAST(trimmedSource);
        this.spinner?.stop();
        const { ast, definitions, perf, sessionId, permalink, commandId } = programAst;
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
          if (def.type === "optionArg") continue;
          const [header, summary] = this.decorators.createDefinition(def);
          Print.text(header, 4);
          Print.text(summary, 6);
        }

        Print.newLine();

        Print.text(`Learn more at ${this.KMDR_WEBAPP_URI}/history/${commandId}`);
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
            this.spinner?.start("Sending your feedback...");
            const status = await this.saveFeedback(answer, sessionId);

            if (status) {
              this.spinner?.succeed("Thank you!");
            } else {
              this.spinner?.fail("Sorry, we couldn't save your feedback this time.");
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
        this.spinner?.fail(err.message);
        Print.error("");
        process.exit(EXIT_STATUS.USER_NOT_AUTHENTICATED);
      } else if (err.code === "ECONNREFUSED") {
        this.spinner?.fail("Could not reach the API registry. Are you connected to the internet?");
        Print.error(err);
        Print.error("");
        process.exit(EXIT_STATUS.API_UNREACHABLE);
      } else if (err !== "") {
        process.exit(EXIT_STATUS.GENERIC);
      }
    }
  }

  protected async hookAfterLoadingAuth() {
    if (!this.kmdrAuthFileExists) {
      Print.error(`No login detected on this machine. Sign in to continue.\n`);
      Print.error(`$ kmdr login`);
      Print.newLine();
      process.exit(EXIT_STATUS.FILE_NOT_PRESENT);
    } else if (!Auth.isTokenValidFormat(this.auth.token)) {
      Print.error(`File ${this.KMDR_AUTH_FILE} is invalid. Delete it and sign in again.\n`);
      Print.error(`$ rm ${this.KMDR_AUTH_FILE} && kmdr login`);
      Print.newLine();
      process.exit(EXIT_STATUS.FILE_INVALID);
    }
  }

  private async getProgramAST(source: string) {
    const gqlQuery = /* GraphQL */ `
      query getProgramAST($source: String!) {
        getProgramAST(source: $source) {
          ast
          definitions
          perf
          sessionId
          permalink
          commandId
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

    let source = "";

    try {
      const input = await prompt<ExplainInputQuery>(inputQuestion);
      source = input.source;
    } catch (err) {
      throw err;
    }

    return source;
  }
}
