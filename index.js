import cli from 'commander';
import nconf from 'nconf';
import os from 'os';
import path from 'path';
import shelljs from 'shelljs';

nconf.file(path.join(os.homedir(), '.kommandrrc'));

console.log(nconf);
cli
  .version('0.0.1')

cli
  .command('config', 'creates config file')

cli
  .command('search [command]', 'search with optional title')

cli
  .command('get [command]')

cli
  .command('save [command]')
  .option('last', 'save last executed command')
  .action((cmd, options) => {
    console.log(cmd, options);
  })

cli.parse(process.argv);