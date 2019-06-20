export const queryExplainCommand = `
query Explain($query: String!) {
  explainCommand(query: $query) {
    query,
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
          manSynopsis
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
      }
    }
  }
}
`;
