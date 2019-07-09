import { GraphQLResponse } from "../interfaces";
import { queryExplainCommand } from "../graphql";
import Client from "./client";
import { AxiosResponse } from "axios";

class Explain extends Client {
  constructor() {
    super();
  }

  public async getExplanation(query: string, schema?: string) {
    const transformResponse = (res: string) => {
      if (res) {
        try {
          const obj = JSON.parse(res) as GraphQLResponse;
          return obj.data;
        } catch (err) {
          throw err;
        }
      }
    };
    return super.doQuery(queryExplainCommand, { query }, { transformResponse });
  }

  /* public render(data: ExplainCommandResponse) {
    const { query, leafNodes } = data.explainCommand;
    const highlight = new Highlight(query);
    leafNodes.forEach((leaf: OptionNodeAST | ProgramNodeAST) => {
      highlight.decorate(leaf);
    });
    console.log(highlight.highlight());
  } */
}

export default Explain;
