"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
class Console {
    async prompt(questions) {
        return inquirer_1.default.prompt(questions);
    }
    async promptInput(questions) {
        return inquirer_1.default.prompt(questions);
    }
    async promptList(questions) {
        return inquirer_1.default.prompt(questions);
    }
    print(content = "", leftSpaces = 0) {
        console.log(`${" ".repeat(leftSpaces)}${content}`);
    }
    log(str) {
        console.log(str);
    }
    clear() {
        console.log("TODO");
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
}
exports.default = Console;
//# sourceMappingURL=console.js.map