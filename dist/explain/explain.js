"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const ast_1 = __importDefault(require("../ast"));
const console_1 = __importDefault(require("../console"));
const decorator_1 = __importDefault(require("../decorator"));
const highlight_1 = __importDefault(require("../highlight"));
const client_1 = require("./client");
class Explain extends console_1.default {
    constructor(config) {
        super();
        this.askOnce = false;
        this.showSyntax = false;
        this.showRelated = false;
        this.client = new client_1.ExplainClient();
        this.askOnce = config.askOnce;
        this.showRelated = config.showRelated;
        this.showSyntax = config.showSyntax;
    }
    async render() {
        do {
            const { query } = await this.promptCommand();
            if (query.trim() === "") {
                this.error("Put a query");
                continue;
            }
            try {
                let sessionId;
                this.startSpinner("Analyzing your command...");
                const res = await this.client.getExplanation(query);
                sessionId = res.headers["x-kmdr-client-session-id"];
                this.stopSpinner();
                const { ast, query: apiQuery } = res.data.explain;
                const serializedAST = ast_1.default.serialize(ast);
                const flatAST = ast_1.default.flatten(serializedAST);
                if (this.showSyntax) {
                    this.printSyntax(apiQuery, flatAST);
                }
                this.print();
                this.printExplanation(flatAST);
                if (this.showRelated) {
                    const program = ast_1.default.getCommandProgram(serializedAST);
                    await this.printRelated(program);
                }
                const { answer } = await this.promptHelpful();
                if (answer !== "skip") {
                    const { comment } = await this.askFeedback(answer);
                    const res = await this.client.sendFeedback(sessionId, answer, comment);
                    if (res) {
                        this.print("Your feedback was sent. Thank you!");
                    }
                }
            }
            catch (err) {
                this.error("There was an error");
                this.error(err);
            }
        } while (!this.askOnce);
    }
    printExplanation(leafNodes) {
        let help = "";
        const offset = 4;
        for (const node of leafNodes) {
            if (ast_1.default.isProgram(node)) {
                const programNode = node;
                const { summary, name } = programNode.schema;
                const decoratedProgramName = decorator_1.default.decorate(name, programNode);
                help += `${" ".repeat(offset)}${decoratedProgramName}\n`;
                help += `${" ".repeat(offset + 2)}${summary}`;
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
                help += `${" ".repeat(offset)}${decoratedOptions.join(", ")}\n`;
                help += `${" ".repeat(offset + 2)}${summary}`;
            }
            if (ast_1.default.isSubcommand(node)) {
                const subcommandNode = node;
                const { name, summary } = subcommandNode.schema;
                const decoratedSubcommandName = decorator_1.default.decorate(name, subcommandNode);
                help += `${" ".repeat(offset)}${decoratedSubcommandName}\n`;
                help += `${" ".repeat(offset + 2)}${summary}`;
            }
            if (ast_1.default.isAssignment(node)) {
                const assignmentNode = node;
                const { word } = assignmentNode;
                const decoratedAssignment = decorator_1.default.decorate(word, assignmentNode);
                help += `${" ".repeat(offset)}${decoratedAssignment}\n`;
                help += `${" ".repeat(offset + 2)}A variable passed to the program process`;
            }
            if (ast_1.default.isOperator(node)) {
                const operatorNode = node;
                const { op } = operatorNode;
                const decoratedOperator = decorator_1.default.decorate(op, operatorNode);
                if (op === "&&") {
                    help += `${" ".repeat(offset)}${decoratedOperator}\n`;
                    help += `${" ".repeat(offset + 2)}Run the next command if and only if the previous command returns a successful exit status (zero)`;
                }
                else if (op === "||") {
                    help += `${" ".repeat(offset)}${decoratedOperator}\n`;
                    help += `${" ".repeat(offset + 2)}Run the next command if and only if the previous command returns a non-zero exit status`;
                }
                else if (op === ";") {
                    help += `${" ".repeat(offset)}${decoratedOperator}\n`;
                    help += `${" ".repeat(offset + 2)}Commands separated by a 0; are executed sequentially; the shell waits for each command to terminate in turn. The return status is the exit status of the last command executed.`;
                }
            }
            if (ast_1.default.isSudo(node)) {
                const sudoNode = node;
                const { summary } = sudoNode.schema;
                const decoratedNode = decorator_1.default.decorate("sudo", sudoNode);
                help += `${" ".repeat(offset)}${decoratedNode}\n${" ".repeat(offset + 2)}${summary}`;
            }
            if (ast_1.default.isArgument(node)) {
                const argNode = node;
                const { word } = argNode;
                const decoratedNode = decorator_1.default.decorate(word, argNode);
                help += `${" ".repeat(offset)}${decoratedNode}\n${" ".repeat(offset + 2)}An argument`;
            }
            if (ast_1.default.isPipe(node)) {
                const pipeNode = node;
                const { pipe } = pipeNode;
                const decoratedNode = decorator_1.default.decorate(pipe, pipeNode);
                help += `${" ".repeat(offset)}${decoratedNode}\n`;
                help += `${" ".repeat(offset + 2)}A pipe serves the sdout of the previous command as input (stdin) to the next one`;
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
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect stdout to ${wordNode.word} even if the shell has been configured to refuse overwriting`;
                }
                else if (type === ">" && input === 2) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect stderr to ${wordNode.word}.`;
                }
                else if (type === "&>" || (type === ">&" && output_fd === null)) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect both stdout and stderr to ${wordNode.word}.`;
                }
                else if (type === ">>" && (input === null || input === 1)) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect and append stdout to ${wordNode.word}.`;
                }
                else if (type === "&>>") {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect and append both stdout and stderr to ${wordNode.word}.`;
                }
                else if (type === ">&" && input === 2 && output_fd === 1) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect stderr to stdout.`;
                }
                else if (type === ">>" && input === 2) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect and append stderr to ${wordNode.word}.`;
                }
                else if (type === "<") {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect stdin from ${wordNode.word}.`;
                }
                else if (type === ">" || (type === ">" && input === 1)) {
                    help += `${" ".repeat(offset)}${decoratedRedirectNode}\n`;
                    help += `${" ".repeat(offset + 2)}Redirect stdout to ${wordNode.word}.`;
                }
            }
            if (ast_1.default.isWord(node)) {
                const wordNode = node;
                const decoratedNode = decorator_1.default.decorate(wordNode.word, wordNode);
                help += `${" ".repeat(offset)}${decoratedNode}\n${" ".repeat(offset + 2)}An argument`;
            }
            help += `\n`;
        }
        this.printTitle("Explanation");
        this.print(help);
    }
    promptCommand() {
        const input = {
            message: "Enter your command",
            name: "query",
        };
        return this.promptInput(input);
    }
    promptHelpful() {
        const choices = {
            choices: [
                {
                    name: this.askOnce ? "Skip & Exit" : "Ask again (Press Ctrl+c to exit)",
                    value: "skip",
                },
                new inquirer_1.Separator(),
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
        this.print();
        return this.prompt(choices);
    }
    askFeedback(answer) {
        let input;
        if (answer === "yes") {
            input = {
                message: "Awesome! What did you like about this explanation?",
                name: "comment",
            };
        }
        else {
            input = {
                message: "What's wrong with the explanation?",
                name: "comment",
            };
        }
        return this.promptInput(input);
    }
    async printRelated(program) {
        this.printTitle("Related Programs");
        if (!program) {
            this.print("Could not find any related programs");
        }
        else {
            const res = await this.client.getRelatedPrograms(program.schema.name);
            const relatedPrograms = res.data.relatedPrograms.map(node => node.name).join(", ");
            this.print(relatedPrograms, 4);
        }
    }
    printSyntax(apiQuery, flatAST) {
        const h = new highlight_1.default();
        const decoratedString = h.decorate(apiQuery, flatAST);
        this.print();
        this.printTitle("Syntax Highlight");
        this.print(decoratedString, 4);
    }
}
exports.Explain = Explain;
//# sourceMappingURL=explain.js.map