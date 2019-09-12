"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const node_emoji_1 = __importDefault(require("node-emoji"));
const ast_1 = __importDefault(require("../ast"));
const decorator_1 = __importDefault(require("../highlight/decorator"));
const highlight_1 = __importDefault(require("../highlight/highlight"));
const console_1 = __importDefault(require("./console"));
// const explanationEmoji = emoji.get("bulb");
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
                type: "input",
            },
        ];
        this.helpfulQuestion = [
            {
                type: "list",
                name: "helpful",
                message: "Did we help you better understand this command?",
                prefix: `${robotEmoji}`,
                choices: ["Skip & Exit", new inquirer_1.default.Separator(), "Yes", "No"],
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
                        help += `  ${decoratedOperator}\n    Run the next command if and only if the previous command returns a successful exit status (zero)`;
                    }
                    else if (op === "||") {
                        help += `  ${decoratedOperator}\n    Run the next command if and only if the previous command returns a non-zero exit status`;
                    }
                    else if (op === ";") {
                        help += `  ${decoratedOperator}\n    Commands separated by a 0; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
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
                    help += `  ${decoratedNode}\n`;
                    help += `    A pipe serves the sdout of the previous command as input (stdin) to the next one`;
                }
                if (ast_1.default.isRedirect(node)) {
                    const redirectNode = node;
                    const { type, output, input, output_fd } = redirectNode;
                    const decoratedRedirectNode = decorator_1.default.decorate(type, redirectNode);
                    let wordNode;
                    if (typeof output === "object") {
                        wordNode = output;
                    }
                    if (type === ">|") {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect stdout to ${wordNode.word} even if the shell has been configured to refuse overwriting`;
                    }
                    else if (type === ">" && input === 2) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect stderr to ${wordNode.word}.`;
                    }
                    else if (type === "&>" || (type === ">&" && output_fd === null)) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect both stdout and stderr to ${wordNode.word}.`;
                    }
                    else if (type === ">>" && (input === null || input === 1)) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect and append stdout to ${wordNode.word}.`;
                    }
                    else if (type === "&>>") {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect and append both stdout and stderr to ${wordNode.word}.`;
                    }
                    else if (type === ">&" && input === 2 && output_fd === 1) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect stderr to stdout.`;
                    }
                    else if (type === ">>" && input === 2) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect and append stderr to ${wordNode.word}.`;
                    }
                    else if (type === "<") {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect stdin from ${wordNode.word}.`;
                    }
                    else if (type === ">" || (type === ">" && input === 1)) {
                        help += `  ${decoratedRedirectNode}\n`;
                        help += `    Redirect stdout to ${wordNode.word}.`;
                    }
                }
                if (ast_1.default.isWord(node)) {
                    const wordNode = node;
                    const decoratedNode = decorator_1.default.decorate(wordNode.word, wordNode);
                    help += `  ${decoratedNode}\n    An argument`;
                }
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
            const help = this.makeHelp(leafNodes);
            this.print(help);
        }
    }
}
exports.default = ExplainConsole;
//# sourceMappingURL=explain.js.map