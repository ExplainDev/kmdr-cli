"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryExplainCommand = `
  query Explain($query: String!) {
    explainCommand(query: $query) {
      query
      leafNodes {
        __typename
        ... on ArgumentNodeAST {
          kind
          word
          pos
          startsWithDash
        }
        ... on AssignmentNodeAST {
          kind
          word
          pos
          value
          value_pos
          name
          name_pos
        }
        ... on OptionNodeAST {
          kind
          word
          opt
          optionSchema {
            long
            short
            summary
            description
          }
          pos
          startsWithDash
        }
        ... on OptionWithArgNodeAST {
          kind
          word
          pos
          option {
            word
            pos
            kind
            optionSchema {
              short
              long
              summary
            }
          }
          arg {
            kind
            word
            pos
          }
        }
        ... on PipeNodeAST {
          kind
          pipe
          pos
        }
        ... on ProgramNodeAST {
          kind
          word
          pos
          programName
          schema {
            name
            summary
            locale
          }
        }
        ... on SubcommandNodeAST {
          kind
          pos
          schema {
            name
            summary
            description
          }
          word
        }
        ... on OperatorNodeAST {
          kind
          word
          op
          pos
        }
        ... on SudoNodeAST {
          kind
          word
          pos
          pos
          schema {
            name
            summary
          }
        }
        ... on RedirectNodeAST {
          kind
          type
          pos
          input
          output {
            kind
            word
            pos
          }
          output_fd
        }
        ... on ReservedWordNodeAST {
          kind
          pos
          word
        }
        ... on WordNodeAST {
          kind
          pos
          word
        }
      }
    }
  }

`;
exports.queryExplain = `
query Explain($query: String!) {
  explain(query: $query) {
    query
    ast
  }
}
`;
exports.mutationCreateExplainFeedback = `
mutation createExplainFeedback($answer: String!, $comment: String) {
  createExplainFeedback(answer: $answer, comment: $comment) {
    answer
    comment
  }
}
`;
//# sourceMappingURL=graphql.js.map