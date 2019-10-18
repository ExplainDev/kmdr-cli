import { InputQuestion, ListQuestion, Separator } from "inquirer";
import AST, {
  ArgumentNode,
  AssignmentNode,
  FlatAST,
  OperatorNode,
  OptionNode,
  PipeNode,
  ProgramNode,
  RedirectNode,
  SubcommandNode,
  SudoNode,
  WordNode,
} from "kmdr-ast";
import { ProgramSchema } from "kmdr-parser";
import Console from "../console";
import Decorator from "../decorator";
import Highlight from "../highlight";
import { ExplainConfig } from "../interfaces";
import ExplainClient from "./explainClient";

export class Explain {
  private client = new ExplainClient();
  private console = new Console();
  private askOnce = false;
  private showSyntax = true;
  private showRelatedPrograms = true;

  constructor(config: ExplainConfig) {
    this.askOnce = config.askOnce;
    this.showRelatedPrograms = config.showRelatedPrograms;
    this.showSyntax = config.showSyntax;
  }

  public async render() {
    do {
      const { query } = await this.promptCommand();

      if (query.trim() === "") {
        this.console.error("Put a query");
        continue;
      }

      try {
        let sessionId: string;

        this.console.startSpinner("Analyzing your command...");
        const res = await this.client.getExplanation(query, this.showRelatedPrograms);
        sessionId = res.headers["x-kmdr-client-session-id"];
        this.console.stopSpinner();

        const { ast, query: apiQuery, relatedPrograms } = res.data.explain;
        const serializedAST = AST.serialize(ast);
        const flatAST = AST.flatten(serializedAST);

        if (this.showSyntax) {
          this.printSyntax(apiQuery, flatAST);
        }

        this.printExplanation(flatAST);

        if (this.showRelatedPrograms) {
          await this.printRelated(relatedPrograms);
        }

        const { answer } = await this.promptHelpful();
        if (answer === "no" || answer === "yes") {
          let comment = "";

          if (answer === "no") {
            const userComment = await this.askFeedback(answer);
            comment = userComment.comment;
          }

          this.console.startSpinner("Sending your feedback...");
          const res = await this.client.sendFeedback(sessionId, answer, comment);

          if (res.data) {
            this.console.succeedSpinner("Your feedback was saved. Thank you!");
          } else {
            this.console.failSpinner("Your feedback wasn't saved. Please try again!");
          }
        }
      } catch (err) {
        this.console.error("There was an error");
        this.console.error(err);
      }
    } while (!this.askOnce);
  }

  private printExplanation(leafNodes: FlatAST) {
    let help = "";
    const margin = 4;

    this.console.printTitle("Explanation", { appendNewLine: false });
    for (const node of leafNodes) {
      if (AST.isProgram(node)) {
        const programNode = node as ProgramNode;
        const { summary, name } = programNode.schema;
        const decoratedProgramName = Decorator.decorate(name, programNode);
        help += `${" ".repeat(margin)}${decoratedProgramName}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      }

      if (AST.isOption(node)) {
        const optionNode = node as OptionNode;
        const { summary, long, short } = optionNode.optionSchema;
        const decoratedOptions = [];

        if (short && short.length >= 1) {
          decoratedOptions.push(Decorator.decorate(short.join(", "), optionNode));
        }

        if (long && long.length >= 1) {
          decoratedOptions.push(Decorator.decorate(long.join(", "), optionNode));
        }

        help += `${" ".repeat(margin)}${decoratedOptions.join(", ")}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      }

      if (AST.isSubcommand(node)) {
        const subcommandNode = node as SubcommandNode;
        const { name, summary } = subcommandNode.schema;
        const decoratedSubcommandName = Decorator.decorate(name, subcommandNode);

        help += `${" ".repeat(margin)}${decoratedSubcommandName}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      }

      if (AST.isAssignment(node)) {
        const assignmentNode = node as AssignmentNode;
        const { word } = assignmentNode;
        const decoratedAssignment = Decorator.decorate(word, assignmentNode);

        help += `${" ".repeat(margin)}${decoratedAssignment}\n`;
        help += `${" ".repeat(margin + 2)}A variable passed to the program process`;
      }

      if (AST.isOperator(node)) {
        const operatorNode = node as OperatorNode;
        const { op } = operatorNode;
        const decoratedOperator = Decorator.decorate(op, operatorNode);

        if (op === "&&") {
          help += `${" ".repeat(margin)}${decoratedOperator}\n`;
          help += `${" ".repeat(
            margin + 2,
          )}Run the next command if and only if the previous command returns a successful exit status (zero)`;
        } else if (op === "||") {
          help += `${" ".repeat(margin)}${decoratedOperator}\n`;
          help += `${" ".repeat(
            margin + 2,
          )}Run the next command if and only if the previous command returns a non-zero exit status`;
        } else if (op === ";") {
          help += `${" ".repeat(margin)}${decoratedOperator}\n`;
          help += `${" ".repeat(
            margin + 2,
          )}Commands separated by a 0; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
        }
      }

      if (AST.isSudo(node)) {
        const sudoNode = node as SudoNode;
        const { summary } = sudoNode.schema;
        const decoratedNode = Decorator.decorate("sudo", sudoNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}${summary}`;
      }

      if (AST.isArgument(node)) {
        const argNode = node as ArgumentNode;
        const { word } = argNode;
        const decoratedNode = Decorator.decorate(word, argNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}An argument`;
      }

      if (AST.isPipe(node)) {
        const pipeNode = node as PipeNode;
        const { pipe } = pipeNode;
        const decoratedNode = Decorator.decorate(pipe, pipeNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n`;
        help += `${" ".repeat(
          margin + 2,
        )}A pipe serves the sdout of the previous command as input (stdin) to the next one`;
      }

      if (AST.isRedirect(node)) {
        const redirectNode = node as RedirectNode;
        const { type, output, input, output_fd } = redirectNode;
        const decoratedRedirectNode = Decorator.decorate(type, redirectNode);
        let wordNode: any;

        if (typeof output === "object") {
          wordNode = output;
        }

        if (type === ">|") {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect stdout to ${
            wordNode.word
          } even if the shell has been configured to refuse overwriting`;
        } else if (type === ">" && input === 2) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect stderr to ${wordNode.word}.`;
        } else if (type === "&>" || (type === ">&" && output_fd === null)) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect both stdout and stderr to ${wordNode.word}.`;
        } else if (type === ">>" && (input === null || input === 1)) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect and append stdout to ${wordNode.word}.`;
        } else if (type === "&>>") {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect and append both stdout and stderr to ${
            wordNode.word
          }.`;
        } else if (type === ">&" && input === 2 && output_fd === 1) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect stderr to stdout.`;
        } else if (type === ">>" && input === 2) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect and append stderr to ${wordNode.word}.`;
        } else if (type === "<") {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect stdin from ${wordNode.word}.`;
        } else if (type === ">" || (type === ">" && input === 1)) {
          help += `${" ".repeat(margin)}${decoratedRedirectNode}\n`;
          help += `${" ".repeat(margin + 2)}Redirect stdout to ${wordNode.word}.`;
        }
      }

      if (AST.isWord(node)) {
        const wordNode = node as WordNode;
        const decoratedNode = Decorator.decorate(wordNode.word, wordNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}An argument`;
      }
      help += `\n`;
    }
    this.console.print(help, { margin: 0 });
  }

  private promptCommand(): Promise<any> {
    const input: InputQuestion = {
      message: "Enter your command:",
      name: "query",
    };

    return this.console.promptInput(input);
  }

  private promptHelpful(): Promise<any> {
    const choices: ListQuestion = {
      choices: [
        {
          name: this.askOnce ? "Skip & Exit" : "Skip feedback & ask again (Ctrl+c to exit)",
          value: "skip",
        },
        {
          name: "Yes",
          value: "yes",
        },
        {
          name: "No",
          value: "no",
        },
      ],
      message: "Did we help you better understand this command?",
      name: "answer",
      type: "list",
    };
    return this.console.prompt(choices);
  }

  private askFeedback(answer: string): Promise<any> {
    let input: InputQuestion;

    input = {
      message: "What's wrong with the explanation?",
      name: "comment",
    };

    return this.console.promptInput(input);
  }

  private async printRelated(programs: ProgramSchema[]) {
    this.console.printTitle("Related Programs", { appendNewLine: false });
    if (programs.length > 0) {
      const relatedPrograms = programs.map(program => program.name).join(", ");
      this.console.print(relatedPrograms, { margin: 4, appendNewLine: true });
    } else {
      this.console.print("Could not find any related programs", { margin: 4, appendNewLine: true });
    }
  }

  private printSyntax(apiQuery: string, flatAST: FlatAST): void {
    const h = new Highlight();
    const decoratedString = h.decorate(apiQuery, flatAST);
    // this.console.printTitle("Syntax Highlight", { prependNewLine: true, margin: 2 });

    this.console.print(decoratedString, { margin: 4, appendNewLine: true, prependNewLine: true });
  }
}
