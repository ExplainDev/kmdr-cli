import cli from 'commander';
import { Settings } from './interfaces';
import ExplainClient from './client/explain';
import ExplainConsole from './console/explain';

class KMDR {
  private settings: Settings | undefined;
  private cli = cli;
  private explainClient: ExplainClient;
  private explainConsole: ExplainConsole;
  constructor(settings?: Settings) {
    this.settings = settings;
    this.explainClient = new ExplainClient();
    this.explainConsole = new ExplainConsole();
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
    let { query } = await this.explainConsole.prompt();
    if (query === '') {
      this.explainConsole.error('Please enter a command');
      return;
    }
    try {
      this.explainConsole.showSpinner('Loading...');
      const res = await this.explainClient.getExplanation(query);
      if (res && res.data) {
        this.explainConsole.render(res.data);
      }
    } catch (err) {
      this.explainConsole.error(err);
    } finally {
      this.explainConsole.hideSpinner();
    }

    /*const { query } = (await explain.prompt()) as { query: string };
      const response = await this.client.explainCommand(query);
      console.log(response);
      if (response && response.data) {
        console.log(response.data);
        /*
        const { explainCommand } = result.data.data;
        console.log(explainCommand);
        explain.render(explainCommand);
        */
  }

  private promptConfig() {
    console.log('promptConfig');
  }
}

export default KMDR;
