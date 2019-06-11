import cli from 'commander';
import { Settings } from './interfaces';

import Client from './client';
import Prompt from './prompt';
/*
const getQuery = (): string => {
  return process.argv.slice(3).join(' ');
};



function decorate(node: { kind: string; word: string; pipe?: string }) {
  switch (node.kind) {
    case 'argument': {
      return HIGHLIGHT.argument(node.word);
    }

    case 'sudo': {
      const unlock = emoji.get('unlock');
      return `${unlock} ${HIGHLIGHT.sudo(node.word)}`;
    }

    case 'operator': {
      return HIGHLIGHT.operator(node.word);
    }

    case 'optionWithArg': {
      return HIGHLIGHT.optionWithArg(node.word);
    }

    case 'pipe': {
      return HIGHLIGHT.pipe(node.pipe || '|');
    }

    case 'program': {
      return HIGHLIGHT.program(node.word);
    }

    case 'stickyOption': {
      return HIGHLIGHT.stickyOption(node.word);
    }

    case 'subcommand': {
      return HIGHLIGHT.subcommand(node.word);
    }

    default: {
      return HIGHLIGHT.word(node.word);
    }
  }
}

function bullet(term: string, definition?: string) {
  return `${term}: ${definition || 'No definition found'}`;
}

function explainProgram(node: ProgramNodeAST): string {
  let definition;
  if (node.schema) {
    definition = node.schema.summary || node.schema.manSynopsis;
  }
  return bullet(decorate(node), definition);
}

function explainSudo(node: SudoNodeAST): string {
  return bullet(decorate(node), 'execute a command as another user, usually as root');
}

function explainComposedOption(node: StickyOptionNodeAST): string {
  return bullet(decorate(node), 'composedOption');
}

function explainOption(node: OptionNodeAST): string {
  let definition;
  if (node.optionSchema) {
    definition = node.optionSchema.summary || node.optionSchema.description;
  }
  return bullet(decorate(node), definition);
}

function explainArgument(node: ArgumentNodeAST): string {
  return bullet(decorate(node), 'An argument passed to the program');
}

function explainSubcommand(node: SubcommandNodeAST): string {
  let definition;
  if (node.schema) {
    definition = node.schema.summary || node.schema.description;
  }

  return bullet(decorate(node), definition);
}

function explainOptionWithArg(node: OptionWithArgNodeAST): string {
  let definition;
  if (node.option.optionSchema) {
    const { optionSchema } = node.option;
    definition = optionSchema.summary || optionSchema.description;
  }

*/

import Explain from './explain';

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  private prompt: any;
  private client: any;

  constructor(settings?: Settings) {
    this.settings = settings;
    this.client = new Client();
    this.prompt = new Prompt();
  }

  public init() {
    this.cli.version('0.1').option('-l, --languate <language>', 'change the language');

    this.cli
      .command('explain [options]')
      .alias('e')
      .alias('exp')
      .description('Explain a command')
      .option('-i, --interactive', 'Opens the program in interactivec mode')
      .option('-s, --schema <file>', 'Use the Schema in file')
      .action(this.promptExplain.bind(this));

    this.cli
      .command('config')
      .alias('c')
      .description('Set or view configuration for kmdr on this computer')
      .action(this.promptConfig.bind(this));

    this.cli.parse(process.argv);
  }

  private async promptExplain(args: any, options: any) {
    try {
      const explain = new Explain();
      const { query } = (await explain.prompt()) as { query: string };
      const result = await this.client.explainCommand(query);
      if (result && result.data) {
        explain.render(result.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private promptConfig() {
    console.log('promptConfig');
  }
}

export default KMDR;
