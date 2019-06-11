export const queryExplainCommand = `
query Explain($query: String!) {
  explainCommand(query: $query) {
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
      identifier
    }
    ... on StickyOptionNodeAST {
      kind
      word
      parts {
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
      pos
      word
      option {
        kind
        pos
        word
        optionSchema {
          long
          short
          summary
          description
        }
      }
      arg {
        word
        pos
        kind
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
        description
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
    ... on PipeNodeAST {
      kind
      pipe
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
`;
