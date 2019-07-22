/**
 * Copyright 2019 Eddie Ramirez
 */
import {
  ArgumentNodeAST,
  AssignmentNodeAST,
  CommandNodeAST,
  ListNodeAST,
  NodeAST,
  OperatorNodeAST,
  OptionNodeAST,
  OptionWithArgNodeAST,
  PipelineNodeAST,
  PipeNodeAST,
  ProgramNodeAST,
  RedirectNodeAST,
  ReservedWordNodeAST,
  StickyOptionNodeAST,
  SubcommandNodeAST,
  WordNodeAST,
} from "./interfaces";

class AST {
  /**
   * Checks if an AssignmentNodeAST matches an identifier with a value
   * @param node
   * @param identifier the identifier name
   * @param value the value we try to validate against
   * @returns true if there's a match, false if not
   */
  public static assignmentHasValue(node: AssignmentNodeAST, name: string, value: string): boolean {
    return node.name === name && node.value === value;
  }

  /**
   * Checks if a CommandNodeAST contains at least 1 AssignmentNodeAST that
   * matches an identifier and a value
   * @param node
   * @param identifier
   * @param value
   * @returns true if a first assignment matches the criteria
   */
  public static commandHasAssignment(node: CommandNodeAST, name: string, value?: string): boolean {
    if (!node.parts) {
      return false;
    }

    for (const currentNode of node.parts) {
      if (AST.isAssignment(currentNode as AssignmentNodeAST)) {
        const assignmentNode = currentNode as AssignmentNodeAST;
        if (
          (value && AST.assignmentHasValue(assignmentNode, name, value)) ||
          (!value && assignmentNode.name === name)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Checks if a CommandNodeAST contains at least 1 ComposedOptionNodeAST that matches the criteria
   * @param node
   * @param stickyOptions
   * @returns true if at least 1 node is of kind stickyOptions and
   *  its word matches stickyOptions string
   */
  public static commandHasStickyOptions(node: CommandNodeAST, stickyOptions: string): boolean {
    if (!node.parts) {
      return false;
    }

    for (const currentNode of node.parts) {
      if (AST.isStickyOption(currentNode) && currentNode.word === stickyOptions) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a CommandNodeAST has an OptionNodeAST with an optionName
   * @param node
   * @param optionName
   * @param argValue
   * @param pos
   */
  public static commandHasOption(
    node: CommandNodeAST | StickyOptionNodeAST,
    optionName: string,
    argValue?: string,
  ): boolean {
    if (!node.parts) {
      return false;
    }

    for (let i = 0; i < node.parts.length; i++) {
      const currentNode = node.parts[i];
      if (AST.isOption(currentNode)) {
        const optionNode = currentNode as OptionNodeAST;
        if (
          (argValue && optionNode.opt === optionName && AST.isArgument(node.parts[i + 1])) ||
          (!argValue && optionNode.opt === optionName)
        ) {
          return true;
        }
      } else if (AST.isOptionWithArg(currentNode)) {
        const composedOptionNode = currentNode as OptionWithArgNodeAST;

        const { option, arg } = composedOptionNode;

        if (
          (argValue && option.opt === optionName && arg.arg === argValue) ||
          (!argValue && option.opt === optionName)
        ) {
          return true;
        }
      } else if (AST.isStickyOption(currentNode)) {
        const composedOptionNode = currentNode as StickyOptionNodeAST;
        return AST.commandHasOption(composedOptionNode, optionName);
      }
    }

    return false;
  }

  public static commandHasProgram(node: CommandNodeAST, programName: string): boolean {
    if (!node.parts) {
      return false;
    }

    for (const currentNode of node.parts) {
      if (AST.isProgram(currentNode as StickyOptionNodeAST)) {
        const programNode = currentNode as ProgramNodeAST;
        return programNode.programName === programName;
      }
    }

    return false;
  }

  public static commandHasSubcommand(
    node: CommandNodeAST,
    subcommandName: string,
    pos: number = 0,
  ): boolean {
    if (!node.parts) {
      return false;
    }

    if (pos < 0) {
      pos = 0;
    }

    for (const currentNode of node.parts) {
      if (AST.isSubcommand(currentNode)) {
        if (pos-- === 0) {
          const subcommandNode = currentNode as SubcommandNodeAST;
          return subcommandNode.word === subcommandName;
        } else if (pos < 0) {
          return false;
        }
      }
    }

    return false;
  }

  public static getAllArguments(node: CommandNodeAST): ArgumentNodeAST[] | undefined {
    if (!node.parts) {
      return [];
    }

    const args: ArgumentNodeAST[] = [];

    for (const currentNode of node.parts) {
      if (AST.isArgument(currentNode as ArgumentNodeAST)) {
        args.push(currentNode);
      }
    }

    return args;
  }

  public static getAllAssignments(node: CommandNodeAST): AssignmentNodeAST[] {
    if (!node.parts) {
      return [];
    }

    const assignments: AssignmentNodeAST[] = [];

    for (const currentNode of node.parts) {
      if (AST.isAssignment(currentNode as any)) {
        assignments.push(currentNode as AssignmentNodeAST);
      }
    }

    return assignments;
  }

  public static getAllRedirects(node: CommandNodeAST): RedirectNodeAST[] {
    if (!node.parts) {
      return [];
    }

    const redirects: RedirectNodeAST[] = [];

    for (const currentNode of node.parts) {
      if (AST.isRedirect(currentNode as any)) {
        redirects.push(currentNode as RedirectNodeAST);
      }
    }

    return redirects;
  }

  public static getAllSubcommands(node: CommandNodeAST): SubcommandNodeAST[] | undefined {
    if (!node.parts) return;

    const subcommands: SubcommandNodeAST[] = [];

    for (let i = 0; i < node.parts.length; i++) {
      const currentNode = node.parts[i];
      if (AST.isSubcommand(<SubcommandNodeAST>currentNode)) {
        subcommands.push(<SubcommandNodeAST>currentNode);
      }
    }
    return subcommands;
  }

  /**
   * Returns all OptionNodeAST in a command
   * @param node
   */
  public static getCommandOptions(
    node: CommandNodeAST | StickyOptionNodeAST,
  ): OptionNodeAST[] | undefined {
    if (!node.parts) {
      return;
    }
    const options: OptionNodeAST[] = [];
    let startPos = 0;

    // First find the ProgramNodeAST position in the tree
    if (AST.isCommand(node)) {
      startPos = AST.getProgramNodePosition(node as CommandNodeAST);
      if (startPos === -1) {
        return;
      }
    }
    // Start iterating the program position
    for (let i = startPos; i < node.parts.length; i++) {
      const currentNode = node.parts[i];

      if (AST.isOption(currentNode)) {
        options.push(currentNode as OptionNodeAST);
      } else if (AST.isStickyOption(currentNode)) {
        const composedOption = currentNode as StickyOptionNodeAST;
        return AST.getCommandOptions(composedOption);
      }
    }
    return options;
  }

  /**
   * Gets the first option in a command
   * @param node
   * @param optionName
   */
  public static getCommandOption(
    node: CommandNodeAST | StickyOptionNodeAST,
    optionName: string,
  ): OptionNodeAST | undefined {
    if (!node.parts) return;

    let startPos = 0;
    if (AST.isCommand(node)) {
      startPos = AST.getProgramNodePosition(<CommandNodeAST>node);
    }

    for (let i = startPos; i < node.parts.length; i++) {
      const currentNode = node.parts[i];
      if (AST.isOption(<OptionNodeAST>currentNode)) {
        const optionNode = <OptionNodeAST>currentNode;
        if (optionNode.opt === optionName) {
          return optionNode;
        }
      } else if (AST.isStickyOption(currentNode)) {
        const composedOptionNode = <StickyOptionNodeAST>currentNode;
        return AST.getCommandOption(composedOptionNode, optionName);
      }
    }
  }

  /*
  static getCommandOptionArgument(node: CommandNodeAST | OptionWithArgNodeAST, optionName: string): ArgumentNodeAST | undefined {
    if (!node.parts) return null;

    let startPos = 0;
    if (AST.isCommand(node)) {
      startPos = AST.getProgramNodePosition(<CommandNodeAST>node);
    }

    for (let i = startPos; i < node.parts.length; i++) {
      const current = node.parts[i];
      if (AST.isOption(current)) {
        return 
      } else if (AST.isComposedOption(current)) {
        const composedOptionNode = <ComposedOptionNodeAST>current;
        return AST.getCommandOptionArgument(composedOptionNode, optionName);
      }
    }
  }
  */
  /**
   * Get the Program of a command
   * @param node
   */
  static getCommandProgram(node: CommandNodeAST): ProgramNodeAST | undefined {
    if (!node.parts) return;

    for (let i = 0; i < node.parts.length; i++) {
      const currentNode = node.parts[i];
      if (AST.isProgram(currentNode)) {
        return <ProgramNodeAST>currentNode;
      }
    }
  }

  /**
   * Returns the last node in a list of nodes.
   * @param node
   * @returns the last node in a list of nodes
   */
  static getLastNode(
    node: CommandNodeAST | ListNodeAST,
  ): CommandNodeAST | ListNodeAST | WordNodeAST | OperatorNodeAST | undefined {
    if (!node.parts) return;

    const lastPos = node.parts.length - 1;
    return node.parts[lastPos];
  }

  static getProgramNodePosition(node: CommandNodeAST): number {
    if (!node.parts) return -1;

    for (let i = 0; i < node.parts.length; i++) {
      const current = node.parts[i];
      if (AST.isProgram(current)) return i;
    }

    return -1;
  }

  public static getSudoOptions(
    node: CommandNodeAST | StickyOptionNodeAST,
  ): OptionNodeAST[] | undefined {
    if (!node.parts) return;
    const options: OptionNodeAST[] = [];

    let stopPos = node.parts.length;
    if (AST.isCommand(node)) {
      stopPos = AST.getProgramNodePosition(<CommandNodeAST>node);
    }

    for (let i = 0; i < stopPos; i++) {
      const currentNode = node.parts[i];
      if (AST.isOption(currentNode)) {
        options.push(<OptionNodeAST>currentNode);
      } else if (AST.isStickyOption(currentNode)) {
        const composedOption = <StickyOptionNodeAST>currentNode;
        return AST.getCommandOptions(composedOption);
      }
    }
    return options;
  }

  public static getSudoOption(
    node: CommandNodeAST | StickyOptionNodeAST,
    optionName: string,
  ): OptionNodeAST | undefined {
    if (!node.parts) return;

    let stopPos = node.parts.length;
    if (AST.isCommand(node)) {
      stopPos = AST.getProgramNodePosition(<CommandNodeAST>node);
    }

    for (let i = 0; i < stopPos; i++) {
      const currentNode = node.parts[i];
      if (AST.isOption(currentNode)) {
        const optionNode = <OptionNodeAST>currentNode;
        if (optionNode.opt === optionName) {
          return optionNode;
        }
      } else if (AST.isStickyOption(currentNode)) {
        const composedOptionNode = <StickyOptionNodeAST>currentNode;
        return AST.getCommandOption(composedOptionNode, optionName);
      }
    }
  }

  /**
   * Checks if a node is of kind command
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'command' else false
   */
  public static isCommand(node: NodeAST): boolean {
    return node.kind === "command";
  }

  /**
   * Checks if a node is of kind composedOption
   * @param node
   * @returns {boolean} true if kind is 'composedOption'
   */
  public static isStickyOption(node: NodeAST): boolean {
    return node.kind === "stickyOption";
  }

  /**
   * Checks if a node is of kind list
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'list' else false
   */
  public static isList(node: NodeAST): boolean {
    return node.kind === "list";
  }

  /**
   * Checks if a node is of kind pipeline
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'pipeline' else false
   */
  public static isPipeline(node: NodeAST): boolean {
    return node.kind === "pipeline";
  }

  /**
   * Checks if node is of kind assignment
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'assignment'
   */
  public static isAssignment(node: NodeAST): boolean {
    return node.kind === "assignment";
  }

  /**
   * Checks if a node is of kind word
   * @param node {NodeASt}
   * @returns {boolean} true if kind is 'word'
   */
  public static isWord(node: NodeAST): boolean {
    return node.kind === "word";
  }

  public static isOptionWithArg(node: NodeAST): boolean {
    return node.kind === "optionWithArg";
  }
  /**
   * Checks if node is of kind operator
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'operator
   */
  public static isOperator(node: NodeAST): boolean {
    return node.kind === "operator";
  }

  /**
   * Checks if node is of kind pipe
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'operator'
   */
  public static isPipe(node: NodeAST): boolean {
    return node.kind === "pipe";
  }

  /**
   * Checks if node is of kind reservedWord
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'reservedWord'
   */
  public static isReservedWord(node: NodeAST): boolean {
    return node.kind === "reservedword";
  }

  /**
   * Checks if a node is of kind redirect
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'redirect'
   */
  public static isRedirect(node: NodeAST): boolean {
    return node.kind === "redirect";
  }

  /**
   * Checks if a node is of kind option
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'option'
   */
  public static isOption(node: NodeAST): boolean {
    return node.kind === "option";
  }

  /**
   * Checks if a node is of kind argument
   * @param node {NodeAST}
   * @returns {boolean} true if kind is 'argument'
   */
  static isArgument(node: NodeAST): boolean {
    return node.kind === "argument";
  }

  /**
   * Checks if a node is of kind compound
   * @param node
   */
  public static isCompound(node: NodeAST): boolean {
    return node.kind === "compound";
  }

  /**
   * Checks if a node is of kind subcommand
   * @param node {NodeAST}
   * @returns true if kind is 'subcommand'
   */
  public static isSubcommand(node: NodeAST): boolean {
    return node.kind === "subcommand";
  }

  /**
   * Checks if a node is of kind program
   * @param node {NodeAST}
   * @returns true if kind is 'program'
   */
  public static isProgram(node: NodeAST): boolean {
    return node.kind === "program";
  }

  /**
   * Checks if a node word is "sudo".
   */
  public static isSudo(node: NodeAST): boolean {
    return node.word === "sudo";
  }

  /**
   * Checks if an option expects an argument, based on a OptionSchema
   * definition
   * @param node
   */
  public static optionExpectsArg(node: OptionNodeAST): boolean {
    if (!node.optionSchema) return false;
    return node.optionSchema.expectsArg || false;
  }

  /**
   * Checks if an OptionNodeAST is followed immediately by an argument
   * @param node the OptionNodeAST to validate
   * @returns true if it's followed by an argument
   */
  public static optionFollowedByArg(node: OptionNodeAST): boolean {
    return node.followedByArg || false;
  }

  public static withSudo(node: CommandNodeAST): boolean {
    if (!node.parts) {
      return false;
    }

    for (let i = 0; i < node.parts.length; i++) {
      const currentNode = node.parts[i];
      if (AST.isSudo(currentNode)) {
        return true;
      }
    }

    return false;
  }
}

export default AST;
