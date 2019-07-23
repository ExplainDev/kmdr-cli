"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
class Console {
    prompt(questions) {
        return __awaiter(this, void 0, void 0, function* () {
            return inquirer_1.default.prompt(questions);
        });
    }
    print(content) {
        console.log(content ? content : "");
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