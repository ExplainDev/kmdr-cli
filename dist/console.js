"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
const cluster_1 = require("cluster");
class Console {
    constructor() {
        this.defaultPrintOptions = {
            appendNewLine: true,
            margin: 2,
            prependNewLine: false,
        };
    }
    async prompt(questions) {
        return inquirer_1.default.prompt(questions);
    }
    async promptInput(questions) {
        return inquirer_1.default.prompt(questions);
    }
    async promptList(questions) {
        return inquirer_1.default.prompt(questions);
    }
    log(str) {
        console.log(str);
    }
    clear() {
        console.clear();
    }
    error(msg) {
        console.error(chalk_1.default.red(msg));
    }
    startSpinner(msg) {
        this.spinner = ora_1.default(msg).start();
    }
    stopSpinner() {
        this.spinner.stop();
    }
    succeedSpinner(text) {
        this.spinner.succeed(text);
    }
    printTitle(title, options = this.defaultPrintOptions) {
        const styledTitle = chalk_1.default.bold.whiteBright(title);
        this.print(styledTitle, options);
    }
    print(msg, options = this.defaultPrintOptions) {
        const { margin, prependNewLine, appendNewLine } = options;
        const spaces = " ".repeat(margin ? margin : 0);
        if (cluster_1.prependListener) {
            console.log();
        }
        console.log(`${spaces}${msg}`);
        if (appendNewLine) {
            console.log();
        }
    }
    render() {
        return;
    }
}
exports.default = Console;
//# sourceMappingURL=console.js.map