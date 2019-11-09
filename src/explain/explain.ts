import { InputQuestion, ListQuestion, Separator } from "inquirer";
import AST, {
  ArgumentNode,
  AssignmentNode,
  CommandNode,
  FlatAST,
  NodeAST,
  OperandNode,
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
  private showExamples = true;

  constructor(config: ExplainConfig) {
    this.askOnce = config.askOnce;
    this.showRelatedPrograms = config.showRelatedPrograms;
    this.showSyntax = config.showSyntax;
    this.showExamples = config.showExamples;
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
        const { headers, data } = await this.client.getExplanation(query, this.showRelatedPrograms);
        sessionId = headers["x-kmdr-client-session-id"];

        if (data.explain === null) {
          this.console.failSpinner("An error occurred. Please try again.");
          continue;
        }
        this.console.stopSpinner();
        const { ast, query: apiQuery, relatedPrograms } = data.explain;
        const serializedAST = AST.serialize(ast);
        const flatAST = AST.flatten(serializedAST);
        if (this.showSyntax) {
          this.printSyntax(apiQuery, flatAST);
        }

        if (flatAST.length === 0) {
          this.printUnavailableExplanation(serializedAST);
        } else {
          this.printExplanation(flatAST);
        }

        if (this.showRelatedPrograms) {
          this.printRelated(relatedPrograms);
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

    for (const [idx, node] of leafNodes.entries()) {
      if (AST.isProgram(node)) {
        const programNode = node as ProgramNode;
        const { summary, name } = programNode.schema;
        const decoratedProgramName = Decorator.decorate(name, programNode);
        help += `${" ".repeat(margin)}${decoratedProgramName}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      } else if (AST.isOption(node)) {
        const optionNode = node as OptionNode;
        const { summary, short, long } = optionNode.optionSchema;
        const decoratedOptions = [];
        let decoratedArg = "";

        if (short && short.length >= 1) {
          decoratedOptions.push(Decorator.decorate(short.join(", "), optionNode));
        }

        if (long && long.length >= 1) {
          decoratedOptions.push(Decorator.decorate(long.join(", "), optionNode));
        }

        if (optionNode.optionSchema.expectsArg && AST.isArgument(leafNodes[idx + 1])) {
          const argNode = leafNodes[idx + 1] as ArgumentNode;
          const { word } = argNode;
          decoratedArg = Decorator.decorate(word, argNode);
        }

        help += `${" ".repeat(margin)}${decoratedOptions.join(", ")} ${decoratedArg}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      } else if (AST.isSubcommand(node)) {
        const subcommandNode = node as SubcommandNode;
        const { name, summary } = subcommandNode.schema;
        const decoratedSubcommandName = Decorator.decorate(name, subcommandNode);

        help += `${" ".repeat(margin)}${decoratedSubcommandName}\n`;
        help += `${" ".repeat(margin + 2)}${summary}`;
      } else if (AST.isAssignment(node)) {
        const assignmentNode = node as AssignmentNode;
        const { word } = assignmentNode;
        const decoratedAssignment = Decorator.decorate(word, assignmentNode);

        help += `${" ".repeat(margin)}${decoratedAssignment}\n`;
        help += `${" ".repeat(margin + 2)}A variable passed to the program process`;
      } else if (AST.isOperator(node)) {
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
      } else if (AST.isSudo(node)) {
        const sudoNode = node as SudoNode;
        const { summary } = sudoNode.schema;
        const decoratedNode = Decorator.decorate("sudo", sudoNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}${summary}`;
      } else if (AST.isPipe(node)) {
        const pipeNode = node as PipeNode;
        const { pipe } = pipeNode;
        const decoratedNode = Decorator.decorate(pipe, pipeNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n`;
        help += `${" ".repeat(
          margin + 2,
        )}A pipe serves the sdout of the previous command as input (stdin) to the next one`;
      } else if (AST.isRedirect(node)) {
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
      } else if (AST.isWord(node)) {
        const wordNode = node as WordNode;
        const decoratedNode = Decorator.decorate(wordNode.word, wordNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}An argument`;
      } else if (AST.isOperand(node)) {
        const operandNode = node as OperandNode;
        const decoratedNode = Decorator.decorate(operandNode.word, operandNode);
        help += `${" ".repeat(margin)}${decoratedNode}\n${" ".repeat(margin + 2)}An operand`;
      } else if (AST.isArgument(node)) {
        continue;
      }
      help += `\n`;
    }
    this.console.printTitle("Explanation", { appendNewLine: false });
    this.console.print(help, { margin: 0 });
  }

  private printUnavailableExplanation(ast: NodeAST) {
    this.console.printTitle("Explanation", { appendNewLine: false });

    if (
      AST.isCommand(ast) &&
      AST.getCommandProgram(ast as CommandNode) === undefined &&
      ast.parts
    ) {
      const wordNodes = ast.parts.filter(part => AST.isWord(part)) as WordNode[];
      if (wordNodes.length > 0) {
        const firstWordNode = wordNodes[0];
        this.console.print(`Could not any explanation for ${firstWordNode.word}`, { margin: 4 });
      } else {
        this.console.print(`Could not any explanation for your query`, { margin: 4 });
      }
    }
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

  private printRelated(programs: ProgramSchema[]) {
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
