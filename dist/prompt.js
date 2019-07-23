"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
class Prompt {
    constructor() {
        this.questions = [
            {
                type: 'input',
                name: 'query',
                message: 'Explain a command: ',
            },
        ];
    }
    explain(interactive) {
        return inquirer_1.default.prompt(this.questions);
    }
}
exports.default = Prompt;
//# sourceMappingURL=prompt.js.map