import { InputQuestion, ListQuestion, Separator } from "inquirer";
import AST from "../ast";
import Console from "../console";
import Decorator from "../decorator";
import Highlight from "../highlight";
import {
  ArgumentNode,
  AssignmentNode,
  ExplainClientInstance,
  ExplainConfig,
  OperatorNode,
  OptionNode,
  PipeNode,
  ProgramNode,
  RedirectNode,
  StickyOptionNode,
  SubcommandNode,
  SudoNode,
  WordNode,
} from "../interfaces";
import { ExplainClient } from "./client";

export class Explain extends Console {
  private client: ExplainClientInstance;
  private askOnce: boolean = false;
  private showSyntax: boolean = false;

  constructor(config: ExplainConfig) {
    super();
    this.client = new ExplainClient();
    this.askOnce = config.askOnce;
    this.showSyntax = config.showSyntax;
  }

  public async render() {
    do {
      const { query } = await this.promptCommand();

      if (query.trim() === "") {
        this.error("Put a query");
        continue;
      }

      try {
        let sessionId: string;

        this.startSpinner("Analyzing your command...");
        const res = await this.client.getExplanation(query);
        sessionId = res.headers["x-kmdr-client-session-id"];
        this.stopSpinner();

        const { ast, query: apiQuery } = res.data.explain;
        const serializedAST = AST.serialize(ast);
        const flatAST = AST.flatten(serializedAST);

        if (this.showSyntax) {
          const h = new Highlight();
          const decoratedString = h.decorate(apiQuery, flatAST);
          this.print();
          this.print("Your query");
          this.print(decoratedString, 2);
        }
        this.print();
        this.print("Explanation");
        const explanation = this.makeExplanation(flatAST);
        this.print(explanation);

        const { answer } = await this.promptHelpful();
        if (answer !== "skip") {
          const { comment } = await this.askFeedback(answer);
          const res = await this.client.sendFeedback(sessionId, answer, comment);
          if (res) {
            this.print("Your feedback was sent. Thank you!");
          }
        }
      } catch (err) {
        this.error("There was an error");
        this.error(err);
      }
    } while (!this.askOnce);
  }

  private makeExplanation(
    leafNodes: Array<
      | OptionNode
      | ProgramNode
      | AssignmentNode
      | SubcommandNode
      | OperatorNode
      | PipeNode
      | StickyOptionNode
      | RedirectNode
    >,
  ): string {
    let help = "";

    for (const node of leafNodes) {
      if (AST.isProgram(node)) {
        const programNode = node as ProgramNode;
        const { summary, name } = programNode.schema;
        const decoratedProgramName = Decorator.decorate(name, programNode);

        help += `  ${decoratedProgramName}\n    ${summary}`;
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

        help += `  ${decoratedOptions.join(", ")}\n    ${summary}`;
      }

      if (AST.isSubcommand(node)) {
        const subcommandNode = node as SubcommandNode;
        const { name, summary } = subcommandNode.schema;
        const decoratedSubcommandName = Decorator.decorate(name, subcommandNode);

        help += `  ${decoratedSubcommandName}\n    ${summary}`;
      }

      if (AST.isAssignment(node)) {
        const assignmentNode = node as AssignmentNode;
        const { word } = assignmentNode;
        const decoratedAssignment = Decorator.decorate(word, assignmentNode);

        help += `  ${decoratedAssignment}\n    A variable passed to the program process`;
      }

      if (AST.isOperator(node)) {
        const operatorNode = node as OperatorNode;
        const { op } = operatorNode;
        const decoratedOperator = Decorator.decorate(op, operatorNode);

        if (op === "&&") {
          help += `  ${decoratedOperator}\n    Run the next command if and only if the previous command returns a successful exit status (zero)`;
        } else if (op === "||") {
          help += `  ${decoratedOperator}\n    Run the next command if and only if the previous command returns a non-zero exit status`;
        } else if (op === ";") {
          help += `  ${decoratedOperator}\n    Commands separated by a 0; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
        }
      }

      if (AST.isSudo(node)) {
        const sudoNode = node as SudoNode;
        const { summary } = sudoNode.schema;
        const decoratedNode = Decorator.decorate("sudo", sudoNode);
        help += `  ${decoratedNode}\n    ${summary}`;
      }

      if (AST.isArgument(node)) {
        const argNode = node as ArgumentNode;
        const { word } = argNode;
        const decoratedNode = Decorator.decorate(word, argNode);
        help += `  ${decoratedNode}\n    An argument`;
      }

      if (AST.isPipe(node)) {
        const pipeNode = node as PipeNode;
        const { pipe } = pipeNode;
        const decoratedNode = Decorator.decorate(pipe, pipeNode);
        help += `  ${decoratedNode}\n`;
        help += `    A pipe serves the sdout of the previous command as input (stdin) to the next one`;
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
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect stdout to ${wordNode.word} even if the shell has been configured to refuse overwriting`;
        } else if (type === ">" && input === 2) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect stderr to ${wordNode.word}.`;
        } else if (type === "&>" || (type === ">&" && output_fd === null)) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect both stdout and stderr to ${wordNode.word}.`;
        } else if (type === ">>" && (input === null || input === 1)) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect and append stdout to ${wordNode.word}.`;
        } else if (type === "&>>") {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect and append both stdout and stderr to ${wordNode.word}.`;
        } else if (type === ">&" && input === 2 && output_fd === 1) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect stderr to stdout.`;
        } else if (type === ">>" && input === 2) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect and append stderr to ${wordNode.word}.`;
        } else if (type === "<") {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect stdin from ${wordNode.word}.`;
        } else if (type === ">" || (type === ">" && input === 1)) {
          help += `  ${decoratedRedirectNode}\n`;
          help += `    Redirect stdout to ${wordNode.word}.`;
        }
      }

      if (AST.isWord(node)) {
        const wordNode = node as WordNode;
        const decoratedNode = Decorator.decorate(wordNode.word, wordNode);
        help += `  ${decoratedNode}\n    An argument`;
      }
      help += `\n`;
    }

    return help;
  }

  private promptCommand(): Promise<any> {
    const input: InputQuestion = {
      message: "Enter your command:",
      name: "query",
    };

    return this.promptInput(input);
  }

  private promptHelpful(): Promise<any> {
    const choices: ListQuestion = {
      choices: [
        {
          name: this.askOnce ? "Skip & Exit" : "Ask again (Press Ctrl+c to exit)",
          value: "skip",
        },
        new Separator(),
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
    return this.prompt(choices);
  }

  private askFeedback(answer: string): Promise<any> {
    let input: InputQuestion;

    if (answer === "yes") {
      input = {
        message: "Awesome! What did you like about this explanation?",
        name: "comment",
      };
    } else {
      input = {
        message: "What's wrong with the explanation?",
        name: "comment",
      };
    }

    return this.promptInput(input);
  }
}
