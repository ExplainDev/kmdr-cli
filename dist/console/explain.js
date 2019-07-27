"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_emoji_1 = __importDefault(require("node-emoji"));
const ast_1 = __importDefault(require("../ast"));
const decorator_1 = __importDefault(require("../highlight/decorator"));
const highlight_1 = __importDefault(require("../highlight/highlight"));
const console_1 = __importDefault(require("./console"));
const inquirer = require("inquirer");
const chalk_1 = __importDefault(require("chalk"));
const explanationEmoji = node_emoji_1.default.get("bulb");
const robotEmoji = node_emoji_1.default.get("robot_face");
const fireEmoji = node_emoji_1.default.get("fire");
const thumbsDownEmoji = node_emoji_1.default.get("thumbsdown");
const helloEmoji = node_emoji_1.default.get("wave");
class ExplainConsole extends console_1.default {
    constructor() {
        super();
        this.explainQuestion = [
            {
                message: "Enter your command:",
                name: "query",
                prefix: `${explanationEmoji}`,
                transformer: (arg) => {
                    return chalk_1.default.whiteBright(arg);
                },
                type: "input",
            },
        ];
        this.helpfulQuestion = [
            {
                type: "list",
                name: "helpful",
                message: "Is this helpful?",
                prefix: `${robotEmoji}`,
                choices: ["Skip & Exit", new inquirer.Separator(), "Yes", "No"],
            },
        ];
        this.yesFeedbackQuestion = [
            {
                message: "Awesome! What did you like about this explanation?",
                name: "comment",
                prefix: `${fireEmoji}`,
                type: "input",
            },
        ];
        this.noFeedbackQuestion = [
            {
                message: "What's wrong with the explanation?",
                name: "comment",
                prefix: `${thumbsDownEmoji}`,
                type: "input",
            },
        ];
    }
    makeHelp(leafNodes) {
        let help = "";
        let i = 0;
        let j = 0;
        for (const unit of leafNodes) {
            for (const node of unit) {
                if (ast_1.default.isProgram(node)) {
                    const programNode = node;
                    const { summary, name } = programNode.schema;
                    const decoratedProgramName = decorator_1.default.decorate(name, programNode);
                    help += `  ${decoratedProgramName}\n    ${summary}`;
                }
                if (ast_1.default.isOption(node)) {
                    const optionNode = node;
                    const { summary, long, short } = optionNode.optionSchema;
                    const decoratedOptions = [];
                    if (short && short.length >= 1) {
                        decoratedOptions.push(decorator_1.default.decorate(short.join(", "), optionNode));
                    }
                    if (long && long.length >= 1) {
                        decoratedOptions.push(decorator_1.default.decorate(long.join(", "), optionNode));
                    }
                    help += `  ${decoratedOptions.join(", ")}\n    ${summary}`;
                }
                if (ast_1.default.isSubcommand(node)) {
                    const subcommandNode = node;
                    const { name, summary } = subcommandNode.schema;
                    const decoratedSubcommandName = decorator_1.default.decorate(name, subcommandNode);
                    help += `  ${decoratedSubcommandName}\n    ${summary}`;
                }
                if (ast_1.default.isAssignment(node)) {
                    const assignmentNode = node;
                    const { word } = assignmentNode;
                    const decoratedAssignment = decorator_1.default.decorate(word, assignmentNode);
                    help += `  ${decoratedAssignment}\n    A variable passed to the program process`;
                }
                if (ast_1.default.isOperator(node)) {
                    const operatorNode = node;
                    const { op } = operatorNode;
                    const decoratedOperator = decorator_1.default.decorate(op, operatorNode);
                    if (op === "&&") {
                        help += `  ${decoratedOperator}\n    Command2 is executed if, and only if, command1 returns an exit status of zero`;
                    }
                    else if (op === "||") {
                        help += `  ${decoratedOperator}\n    Command2  is  executed  if and only if command1 returns a non-zero exit status`;
                    }
                    else if (op === ";") {
                        help += `  ${decoratedOperator}\n    Commands separated by a ; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
                    }
                }
                if (ast_1.default.isSudo(node)) {
                    const sudoNode = node;
                    const { summary } = sudoNode.schema;
                    const decoratedNode = decorator_1.default.decorate("sudo", sudoNode);
                    help += `  ${decoratedNode}\n    ${summary}`;
                }
                if (ast_1.default.isArgument(node)) {
                    const argNode = node;
                    const { word } = argNode;
                    const decoratedNode = decorator_1.default.decorate(word, argNode);
                    help += `  ${decoratedNode}\n    An argument`;
                }
                if (ast_1.default.isPipe(node)) {
                    const pipeNode = node;
                    const { pipe } = pipeNode;
                    const decoratedNode = decorator_1.default.decorate(pipe, pipeNode);
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
    async prompt() {
        return super.prompt(this.explainQuestion);
    }
    async wasItHelpful() {
        const answer = await super.prompt(this.helpfulQuestion);
        return answer.helpful;
    }
    async yesFeedback() {
        const answer = await super.prompt(this.yesFeedbackQuestion);
        return answer.comment;
    }
    async noFeedback() {
        const answer = await super.prompt(this.noFeedbackQuestion);
        return answer.comment;
    }
    error(msg) {
        super.error(msg);
    }
    render(data) {
        const { query, leafNodes } = data.explainCommand;
        this.print();
        if (leafNodes.length === 0) {
            this.error("Your query didn't match any program in our database. Please try with another program");
        }
        else {
            const highlight = new highlight_1.default();
            const decoratedQuery = highlight.decorate(query, leafNodes);
            // const boxedContent = this.box(decoratedQuery);
            // add a new line
            // this.print(`  ${decoratedQuery}`);
            const help = this.makeHelp(leafNodes);
            //this.print();
            this.print(help);
        }
        this.print();
    }
}
exports.default = ExplainConsole;
//# sourceMappingURL=explain.js.map