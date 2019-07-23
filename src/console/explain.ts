import emoji from "node-emoji";
import AST from "../ast";
import Decorator from "../highlight/decorator";
import Highlight from "../highlight/highlight";
import {
  ArgumentNodeAST,
  AssignmentNodeAST,
  ConsoleAnswers,
  ExplainCommandResponse,
  OperatorNodeAST,
  OptionNodeAST,
  PipeNodeAST,
  ProgramNodeAST,
  StickyOptionNodeAST,
  SubcommandNodeAST,
  SudoNodeAST,
  ReservedWordNodeAST,
} from "../interfaces";
import Console from "./console";
import inquirer = require("inquirer");

const explanationEmoji = emoji.get("bulb");
const robotEmoji = emoji.get("robot_face");
const fireEmoji = emoji.get("fire");
const thumbsDownEmoji = emoji.get("thumbsdown");

class ExplainConsole extends Console {
  private explainQuestion: Object[] = [
    {
      message: "What's the command?",
      name: "query",
      prefix: `${explanationEmoji}`,
      type: "input",
    },
  ];

  private helpfulQuestion: Object[] = [
    {
      type: "list",
      name: "helpful",
      message: "Is this helpful?",
      prefix: `${robotEmoji}`,
      choices: ["Skip", new inquirer.Separator(), "Yes", "No"],
    },
  ];

  private yesFeedbackQuestion: Object[] = [
    {
      message: "Awesome! What did you like about this explanation?",
      name: "comment",
      prefix: `${fireEmoji}`,
      type: "input",
    },
  ];

  private noFeedbackQuestion: Object[] = [
    {
      message: "What's wrong with the explanation?",
      name: "comment",
      prefix: `${thumbsDownEmoji}`,
      type: "input",
    },
  ];

  constructor() {
    super();
  }

  public makeHelp(
    leafNodes: Array<
      Array<
        | OptionNodeAST
        | ProgramNodeAST
        | AssignmentNodeAST
        | SubcommandNodeAST
        | OperatorNodeAST
        | PipeNodeAST
        | StickyOptionNodeAST
      >
    >,
  ): string {
    let help = "";
    let i = 0;
    let j = 0;

    for (const unit of leafNodes) {
      for (const node of unit) {
        if (AST.isProgram(node)) {
          const programNode = node as ProgramNodeAST;
          const { summary, name } = programNode.schema;
          const decoratedProgramName = Decorator.decorate(name, programNode);

          help += `  ${decoratedProgramName}\n    ${summary}`;
        }

        if (AST.isOption(node)) {
          const optionNode = node as OptionNodeAST;
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
          const subcommandNode = <SubcommandNodeAST>node;
          const { name, summary } = subcommandNode.schema;
          const decoratedSubcommandName = Decorator.decorate(name, subcommandNode);

          help += `  ${decoratedSubcommandName}\n    ${summary}`;
        }

        if (AST.isAssignment(node)) {
          const assignmentNode = node as AssignmentNodeAST;
          const { word } = assignmentNode;
          const decoratedAssignment = Decorator.decorate(word, assignmentNode);

          help += `  ${decoratedAssignment}\n    A variable passed to the program process`;
        }

        if (AST.isOperator(node)) {
          const operatorNode = <OperatorNodeAST>node;
          const { op } = operatorNode;
          const decoratedOperator = Decorator.decorate(op, operatorNode);

          if (op === "&&") {
            help += `  ${decoratedOperator}\n    Command2 is executed if, and only if, command1 returns an exit status of zero`;
          } else if (op === "||") {
            help += `  ${decoratedOperator}\n    Command2  is  executed  if and only if command1 returns a non-zero exit status`;
          } else if (op === ";") {
            help += `  ${decoratedOperator}\n    Commands separated by a ; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
          }
        }

        if (AST.isSudo(node)) {
          const sudoNode = node as SudoNodeAST;
          const { summary } = sudoNode.schema;
          const decoratedNode = Decorator.decorate("sudo", sudoNode);
          help += `  ${decoratedNode}\n    ${summary}`;
        }

        if (AST.isArgument(node)) {
          const argNode = node as ArgumentNodeAST;
          const { word } = argNode;
          const decoratedNode = Decorator.decorate(word, argNode);
          help += `  ${decoratedNode}\n    An argument`;
        }

        if (AST.isPipe(node)) {
          const pipeNode = node as PipeNodeAST;
          const { pipe } = pipeNode;
          const decoratedNode = Decorator.decorate(pipe, pipeNode);
          help += `  ${decoratedNode}\n    A pipe connects the STDOUT of the first process to the STDIN of the second`;
        }

        /*
        if (AST.isReservedWord(node)) {
          const reservedWordNode = node as ReservedWordNodeAST;
          const { word } = reservedWordNode;
          const decoratedNode = Decorator.decorate(word, reservedWordNode);
          help += `  ${decoratedNode}\n  A list of commands\n`;
        }
        
        */
        if (++j !== unit.length) {
          help += `\n`;
        }
      }
      if (++i !== leafNodes.length) {
        help += `\n`;
      }
    }

    return help;
  }

  public async prompt(): Promise<ConsoleAnswers> {
    this.print("kmdr explains shell commands right on your terminal!");
    return super.prompt(this.explainQuestion);
  }

  public async wasItHelpful() {
    const answer = await super.prompt(this.helpfulQuestion);
    return answer.helpful;
  }

  public async yesFeedback() {
    const answer = await super.prompt(this.yesFeedbackQuestion);
    return answer.comment;
  }

  public async noFeedback() {
    const answer = await super.prompt(this.noFeedbackQuestion);
    return answer.comment;
  }

  public error(msg: string) {
    super.error(msg);
  }

  public render(data: ExplainCommandResponse) {
    const { query, leafNodes } = data.explainCommand;
    this.print();

    if (leafNodes.length === 0) {
      this.error(
        "Your query didn't match any program in our database. Please try with another program",
      );
    } else {
      const highlight = new Highlight();
      const decoratedQuery = highlight.decorate(query, leafNodes);
      // const boxedContent = this.box(decoratedQuery);

      // add a new line
      this.print(`  ${decoratedQuery}`);

      const help = this.makeHelp(leafNodes);

      this.print();

      this.print(help);
    }
    this.print();
  }
}

export default ExplainConsole;
