import {
  ArgumentNodeDefinition,
  ASTNode,
  Decorators,
  NodeDefinition,
  OptionNodeDefinition,
  ProgramNodeDefinition,
  SubcommandNodeDefinition,
} from "kmdr-ast";
import Theme from "./ThemeManager";

const DEFAULT_THEME = "GreenWay";

export default class CliDecorators implements Decorators<string> {
  public theme: Theme;

  constructor(theme: Theme) {
    this.theme = theme;
  }

  public createDefinition(definition: NodeDefinition): string[] {
    let header = "";
    let summary = "";

    const { type } = definition;

    switch (type) {
      case "option": {
        const optionDefinition = definition as OptionNodeDefinition;

        const { long, short } = optionDefinition.metadata;

        let allOptions: string[] = [];

        if (short) {
          allOptions = [...short];
        }

        if (long) {
          allOptions = [...allOptions, ...long];
        }

        const decoratedOptions = allOptions.map((opt) => this.option(opt)).join(", ");

        //header = `${decoratedOptions}   ${this.theme.print("tokenKind", type)}`;
        header = `${decoratedOptions}`;

        summary = definition.metadata.summary;
        break;
      }
      case "program": {
        const programDefinition = definition as ProgramNodeDefinition;
        const { name } = programDefinition.metadata;

        //header = `${this.program(name)}   ${this.theme.print("tokenKind", type)}`;
        header = `${this.program(name)}`;

        summary = definition.metadata.summary;
        break;
      }
      case "argument": {
        const argumentDefinition = definition as ArgumentNodeDefinition;
        const { name, value } = argumentDefinition.metadata;

        header = `${this.argument(value)}`;
        summary = definition.metadata.summary;
        break;
      }
      case "subcommand": {
        const subcommandDefinition = definition as SubcommandNodeDefinition;
        const { name } = subcommandDefinition.metadata;

        header = `${this.subcommand(name)}`;
        summary = definition.metadata.summary;
        break;
      }
    }

    return [header, summary];
  }

  public argument(text: string, _definition?: NodeDefinition) {
    return this.theme.print("argument", text);
  }

  public arithmeticOperator(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public backtick(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public bitwiseOperator(text: string, _definition?: NodeDefinition) {
    return this.theme.print("operator", text);
  }

  public braces(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public brackets(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public command(text: string) {
    return text;
  }

  public comment(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public do(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public doubleQuotes(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public done(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public elif(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public else(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public equal(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public fi(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public fileDescriptor(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public fn(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public for(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public if(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public in(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public logicalOperator(text: string, _definition?: NodeDefinition) {
    return this.theme.print("operator", text);
  }

  public newLine() {
    return "\n";
  }

  public operator(text: string, _definition?: NodeDefinition) {
    return this.theme.print("operator", text);
  }

  public option(text: string, _definition?: NodeDefinition) {
    return this.theme.print("option", text);
  }

  public optionArg(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public parens(text: string) {
    return text;
  }

  public pipeline(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public program(text: string, _definition?: NodeDefinition) {
    return this.theme.print("program", text);
  }

  public redirect(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public relationalOperator(text: string, _definition?: NodeDefinition) {
    return this.theme.print("operator", text);
  }

  public semicolon(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public space() {
    return " ";
  }

  public subcommand(text: string, _definition?: NodeDefinition) {
    return this.theme.print("subcommand", text);
  }

  public testOperator(text: string, _definition?: NodeDefinition) {
    return this.theme.print("operator", text);
  }

  public then(text: string, _definition?: NodeDefinition) {
    return this.theme.print("keyword", text);
  }

  public variableName(text: string, _definition?: NodeDefinition) {
    return text;
  }

  public while(text: string) {
    return this.theme.print("keyword", text);
  }

  public word(text: string, _definition?: NodeDefinition) {
    return text;
  }
}
