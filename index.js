import cli from 'commander';
import nconf from 'nconf';
import os from 'os';
import path from 'path';
import shelljs from 'shelljs';
import { GraphQLClient } from 'graphql-request';
import { prompt } from 'inquirer';

nconf.file(path.join(os.homedir(), '.kommandrrc'));
nconf.defaults({
  user: 'anon',
});

const version = '0.0.1';

const graphqlClient = new GraphQLClient('http://localhost:5001/graphql', {
  headers: {
    authorization: 'token',
    'User-agent': `kommandr-cli ${version}`,
    username: nconf.get('user'),
    token: nconf.get('token'),
  }
});



cli
  .command('search [command]', 'search with optional title')
  .action((cmd, options) => {
    console.log(options);
  });

cli
  .command('save [command]')
  .action((cmd, options) => {
    const mutation = `
      mutation addKommandr($title: String!, $cli: String!, $description: String) {
        kommandr: addKommandr(title: $title, cli: $cli, description: $description) {
          id
        }
      }
    `;
    const questions = [
      {
        type: 'input',
        name: 'cli',
        message: 'Command: ',
        validate: (input) => {
          return (input.trim().length > 0) ? true : 'You must enter a command!';
        }
      },
      {
        type: 'input',
        name: 'title',
        message: 'Title: ',
        validate: (input) => {
          return (input.trim().length > 0) ? true : 'You must enter a title!';
        }
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description: ',
      }
    ];
    prompt(questions).then(answers => {
      graphqlClient.request(mutation, answers)
        .then(({ kommandr }) => {
          if (kommandr.id) {
            console.log('Your Kommandr has been saved as an anonymous user!');
            console.log(`Go to http://kommandr.com:5000/k/${kommandr.id}`);
          }
        });
    });
  });

cli.version(version)
cli.parse(process.argv);