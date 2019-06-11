import axios from 'axios';
import { queryExplainCommand } from './graphql';

class Client {
  private url: string;
  private username?: string;
  private token?: string;

  constructor(username?: string, token?: string) {
    this.url = 'http://localhost:8081/api/graphql';
    this.username = username;
    this.token = token;
  }

  public async explainCommand(query: string, schema?: string[]) {
    try {
      return axios.post(
        this.url,
        {
          query: queryExplainCommand,
          variables: {
            query,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      console.error('Error fetching...');
      console.error(err);
    }
  }

  public config() {}
}

export default Client;
