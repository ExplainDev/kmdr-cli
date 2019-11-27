import { InputQuestion, ListQuestion } from "inquirer";
import AST, {
  ArgumentNode,
  AssignmentNode,
  CommandNode,
  FlatAST,
  Highlight,
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
import { Command, ProgramSchema } from "kmdr-parser";
import Console from "../console";
import { ExplainConfig } from "../interfaces";
import ExplainClient from "./explainClient";
import { decorators } from "../theme";

export class Explain {
  private client = new ExplainClient();
  private console = new Console();
  private promptAgain = true;
  private showSyntax = true;
  private showRelatedPrograms = true;
  private showExamples = true;

  constructor(config: ExplainConfig) {
    this.promptAgain = config.promptAgain;
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
        const { ast, query: apiQuery, relatedPrograms, examples } = data.explain;
        const serializedAST = AST.serialize(ast);
        const flatAST = AST.flatten(serializedAST);

        if (this.showSyntax) {
          this.printSyntax(apiQuery, serializedAST);
        }

        if (flatAST.length === 0) {
          this.printUnavailableExplanation(serializedAST);
        } else {
          this.printExplanation(flatAST);
        }

        if (this.showExamples) {
          this.printExamples(examples);
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
    } while (this.promptAgain);
  }

  private printExplanation(leafNodes: FlatAST) {
    const margin = 4;
    this.console.printTitle("EXPLANATION", { appendNewLine: false });
    const highlight = new Highlight(decorators);

    for (const [idx, node] of leafNodes.entries()) {
      if (AST.isProgram(node)) {
        const programNode = node as ProgramNode;
        const { summary, name } = programNode.schema;
        const decoratedProgramName = highlight.token(programNode);
        this.console.print(decoratedProgramName, { margin });
        this.console.print(summary, { margin: margin + 2, wrap: true });
      } else if (AST.isOption(node)) {
        const optionNode = node as OptionNode;
        const { summary, short, long } = optionNode.optionSchema;
        const decoratedOptions = [];
        let decoratedArg = "";

        if (short && short.length >= 1) {
          decoratedOptions.push(highlight.token(optionNode));
        }

        if (long && long.length >= 1) {
          decoratedOptions.push(highlight.token(optionNode));
        }

        if (
          leafNodes[idx + 1] !== undefined &&
          optionNode.optionSchema.expectsArg &&
          AST.isArgument(leafNodes[idx + 1])
        ) {
          const argNode = leafNodes[idx + 1] as ArgumentNode;
          const { word } = argNode;
          decoratedArg = highlight.token(argNode);
          this.console.print(`${decoratedOptions.join(", ")} ${decoratedArg}`, { margin });
        } else {
          this.console.print(`${decoratedOptions.join(", ")}`, { margin });
        }

        this.console.print(summary, { margin: margin + 2, wrap: true });
      } else if (AST.isSubcommand(node)) {
        const subcommandNode = node as SubcommandNode;
        const { name, summary } = subcommandNode.schema;
        const decoratedSubcommandName = highlight.token(subcommandNode);

        this.console.print(decoratedSubcommandName, { margin });
        this.console.print(summary, { margin: margin + 2, wrap: true });
      } else if (AST.isAssignment(node)) {
        const assignmentNode = node as AssignmentNode;
        const { word } = assignmentNode;
        const decoratedAssignment = highlight.token(assignmentNode);

        this.console.print(decoratedAssignment, { margin });
        this.console.print("A variable passed to the program process", {
          margin: margin + 2,
          wrap: true,
        });
      } else if (AST.isOperator(node)) {
        const operatorNode = node as OperatorNode;
        const { op } = operatorNode;
        const decoratedOperator = highlight.token(operatorNode);
        this.console.print(decoratedOperator, { margin });
        let help = "";
        if (op === "&&") {
          help += `Run the next command if and only if the previous command returns a successful exit status (zero)`;
        } else if (op === "||") {
          help += `Run the next command if and only if the previous command returns a non-zero exit status`;
        } else if (op === ";") {
          help += `Commands separated by a ; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed`;
        }
        this.console.print(help, { margin: margin + 2, wrap: true });
      } else if (AST.isSudo(node)) {
        const sudoNode = node as SudoNode;
        const { summary } = sudoNode.schema;
        const decoratedNode = highlight.token(sudoNode);
        this.console.print(decoratedNode, { margin });
        this.console.print(summary, { margin: margin + 2, wrap: true });
      } else if (AST.isPipe(node)) {
        const pipeNode = node as PipeNode;
        const { pipe } = pipeNode;
        const decoratedNode = highlight.token(pipeNode);
        this.console.print(decoratedNode, { margin });
        this.console.print(
          "A pipe serves the sdout of the previous command as input (stdin) to the next one",
          { margin: margin + 2, wrap: true },
        );
      } else if (AST.isRedirect(node)) {
        const redirectNode = node as RedirectNode;
        const { type, output, input, output_fd } = redirectNode;
        const decoratedRedirectNode = highlight.token(redirectNode);
        let wordNode: any;

        if (typeof output === "object") {
          wordNode = output;
        }

        this.console.print(decoratedRedirectNode, { margin });
        let help = "";

        if (type === ">|") {
          help = `even if the shell has been configured to refuse overwriting`;
        } else if (type === ">" && input === 2) {
          help = `Redirect stderr to ${wordNode.word}.`;
        } else if (type === "&>" || (type === ">&" && output_fd === null)) {
          help = `Redirect both stdout and stderr to ${wordNode.word}`;
        } else if (type === ">>" && (input === null || input === 1)) {
          help = `Redirect and append stdout to ${wordNode.word}`;
        } else if (type === "&>>") {
          help = `Redirect and append both stdout and stderr to ${wordNode.word}.`;
        } else if (type === ">&" && input === 2 && output_fd === 1) {
          help = `Redirect stderr to stdout`;
        } else if (type === ">>" && input === 2) {
          help = `Redirect and append stderr to ${wordNode.word}.`;
        } else if (type === "<") {
          help = `Redirect stdin from ${wordNode.word}.`;
        } else if (type === ">" || (type === ">" && input === 1)) {
          help = `Redirect stdout to ${wordNode.word}.`;
        }
        this.console.print(help, { margin: margin + 2, wrap: true });
      } else if (AST.isOperand(node)) {
        const operandNode = node as OperandNode;
        const decoratedNode = highlight.token(operandNode);
        this.console.print(decoratedNode, { margin });
        this.console.print("An operand", { margin: margin + 2, wrap: true });
      } else if (AST.isArgument(node)) {
        continue;
      }
    }
    this.console.print("", { appendNewLine: false, prependNewLine: false });
  }

  private printUnavailableExplanation(ast: NodeAST) {
    this.console.printTitle("EXPLANATION", { appendNewLine: false });

    if (
      AST.isCommand(ast) &&
      AST.getCommandProgram(ast as CommandNode) === undefined &&
      ast.parts
    ) {
      const wordNodes = ast.parts.filter(part => AST.isWord(part)) as WordNode[];
      if (wordNodes.length > 0) {
        const firstWordNode = wordNodes[0];
        this.console.print(`Could not find any explanation for ${firstWordNode.word}`, {
          margin: 4,
          appendNewLine: true,
        });
      } else {
        this.console.print(`Could not find any explanation for your query`, { margin: 4 });
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
          name: !this.promptAgain ? "Skip & Exit" : "Skip feedback & ask again (Ctrl+c to exit)",
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
    this.console.printTitle("RELATED PROGRAMS", { appendNewLine: false });
    if (programs.length === 0) {
      this.console.print("Could not find any related programs", { margin: 4, appendNewLine: true });
    } else {
      const relatedPrograms = programs.map(program => program.name).join(", ");
      this.console.print(relatedPrograms, { margin: 4, appendNewLine: true });
    }
  }

  private printSyntax(apiQuery: string, ast: NodeAST): void {
    const h = new Highlight(decorators);
    const decoratedString = h.query(apiQuery, ast).join("");

    this.console.print(decoratedString, {
      appendNewLine: true,
      margin: 4,
      prependNewLine: true,
      wrap: false,
    });
  }

  private printExamples(examples: Command[]) {
    this.console.printTitle("EXAMPLES", { appendNewLine: false });

    if (examples.length === 0) {
      this.console.print("Could not find any example", { margin: 4, appendNewLine: true });
    } else {
      const highlight = new Highlight(decorators);

      for (const example of examples) {
        const { summary, command, ast } = example;

        let decoratedCommand: string | undefined;

        if (ast) {
          const serializedAST = AST.serialize(ast);
          decoratedCommand = highlight.query(command, serializedAST).join("");
        }

        this.console.print(decoratedCommand ?? command, {
          appendNewLine: false,
          margin: 4,
          prependNewLine: false,
        });
        this.console.print(summary, {
          appendNewLine: false,
          margin: 6,
          prependNewLine: false,
          wrap: true,
        });
      }

      this.console.printNewLine();
    }
  }
}
