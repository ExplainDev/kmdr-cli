"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AST {
    /**
     * Checks if an AssignmentNodeAST matches an identifier with a value
     * @param node
     * @param identifier the identifier name
     * @param value the value we try to validate against
     * @returns true if there's a match, false if not
     */
    static assignmentHasValue(node, name, value) {
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
    static commandHasAssignment(node, name, value) {
        if (!node.parts) {
            return false;
        }
        for (const currentNode of node.parts) {
            if (AST.isAssignment(currentNode)) {
                const assignmentNode = currentNode;
                if ((value && AST.assignmentHasValue(assignmentNode, name, value)) ||
                    (!value && assignmentNode.name === name)) {
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
    static commandHasStickyOptions(node, stickyOptions) {
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
    static commandHasOption(node, optionName, argValue) {
        if (!node.parts) {
            return false;
        }
        for (let i = 0; i < node.parts.length; i++) {
            const currentNode = node.parts[i];
            if (AST.isOption(currentNode)) {
                const optionNode = currentNode;
                if ((argValue && optionNode.opt === optionName && AST.isArgument(node.parts[i + 1])) ||
                    (!argValue && optionNode.opt === optionName)) {
                    return true;
                }
            }
            else if (AST.isOptionWithArg(currentNode)) {
                const composedOptionNode = currentNode;
                const { option, arg } = composedOptionNode;
                if ((argValue && option.opt === optionName && arg.arg === argValue) ||
                    (!argValue && option.opt === optionName)) {
                    return true;
                }
            }
            else if (AST.isStickyOption(currentNode)) {
                const composedOptionNode = currentNode;
                return AST.commandHasOption(composedOptionNode, optionName);
            }
        }
        return false;
    }
    static commandHasProgram(node, programName) {
        if (!node.parts) {
            return false;
        }
        for (const currentNode of node.parts) {
            if (AST.isProgram(currentNode)) {
                const programNode = currentNode;
                return programNode.programName === programName;
            }
        }
        return false;
    }
    static commandHasSubcommand(node, subcommandName, pos = 0) {
        if (!node.parts) {
            return false;
        }
        if (pos < 0) {
            pos = 0;
        }
        for (const currentNode of node.parts) {
            if (AST.isSubcommand(currentNode)) {
                if (pos-- === 0) {
                    const subcommandNode = currentNode;
                    return subcommandNode.word === subcommandName;
                }
                else if (pos < 0) {
                    return false;
                }
            }
        }
        return false;
    }
    static getAllArguments(node) {
        if (!node.parts) {
            return [];
        }
        const args = [];
        for (const currentNode of node.parts) {
            if (AST.isArgument(currentNode)) {
                args.push(currentNode);
            }
        }
        return args;
    }
    static getAllAssignments(node) {
        if (!node.parts) {
            return [];
        }
        const assignments = [];
        for (const currentNode of node.parts) {
            if (AST.isAssignment(currentNode)) {
                assignments.push(currentNode);
            }
        }
        return assignments;
    }
    static getAllRedirects(node) {
        if (!node.parts) {
            return [];
        }
        const redirects = [];
        for (const currentNode of node.parts) {
            if (AST.isRedirect(currentNode)) {
                redirects.push(currentNode);
            }
        }
        return redirects;
    }
    static getAllSubcommands(node) {
        if (!node.parts)
            return;
        const subcommands = [];
        for (let i = 0; i < node.parts.length; i++) {
            const currentNode = node.parts[i];
            if (AST.isSubcommand(currentNode)) {
                subcommands.push(currentNode);
            }
        }
        return subcommands;
    }
    /**
     * Returns all OptionNodeAST in a command
     * @param node
     */
    static getCommandOptions(node) {
        if (!node.parts) {
            return;
        }
        const options = [];
        let startPos = 0;
        // First find the ProgramNodeAST position in the tree
        if (AST.isCommand(node)) {
            startPos = AST.getProgramNodePosition(node);
            if (startPos === -1) {
                return;
            }
        }
        // Start iterating the program position
        for (let i = startPos; i < node.parts.length; i++) {
            const currentNode = node.parts[i];
            if (AST.isOption(currentNode)) {
                options.push(currentNode);
            }
            else if (AST.isStickyOption(currentNode)) {
                const composedOption = currentNode;
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
    static getCommandOption(node, optionName) {
        if (!node.parts)
            return;
        let startPos = 0;
        if (AST.isCommand(node)) {
            startPos = AST.getProgramNodePosition(node);
        }
        for (let i = startPos; i < node.parts.length; i++) {
            const currentNode = node.parts[i];
            if (AST.isOption(currentNode)) {
                const optionNode = currentNode;
                if (optionNode.opt === optionName) {
                    return optionNode;
                }
            }
            else if (AST.isStickyOption(currentNode)) {
                const composedOptionNode = currentNode;
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
    static getCommandProgram(node) {
        if (!node.parts)
            return;
        for (let i = 0; i < node.parts.length; i++) {
            const currentNode = node.parts[i];
            if (AST.isProgram(currentNode)) {
                return currentNode;
            }
        }
    }
    /**
     * Returns the last node in a list of nodes.
     * @param node
     * @returns the last node in a list of nodes
     */
    static getLastNode(node) {
        if (!node.parts)
            return;
        const lastPos = node.parts.length - 1;
        return node.parts[lastPos];
    }
    static getProgramNodePosition(node) {
        if (!node.parts)
            return -1;
        for (let i = 0; i < node.parts.length; i++) {
            const current = node.parts[i];
            if (AST.isProgram(current))
                return i;
        }
        return -1;
    }
    static getSudoOptions(node) {
        if (!node.parts)
            return;
        const options = [];
        let stopPos = node.parts.length;
        if (AST.isCommand(node)) {
            stopPos = AST.getProgramNodePosition(node);
        }
        for (let i = 0; i < stopPos; i++) {
            const currentNode = node.parts[i];
            if (AST.isOption(currentNode)) {
                options.push(currentNode);
            }
            else if (AST.isStickyOption(currentNode)) {
                const composedOption = currentNode;
                return AST.getCommandOptions(composedOption);
            }
        }
        return options;
    }
    static getSudoOption(node, optionName) {
        if (!node.parts)
            return;
        let stopPos = node.parts.length;
        if (AST.isCommand(node)) {
            stopPos = AST.getProgramNodePosition(node);
        }
        for (let i = 0; i < stopPos; i++) {
            const currentNode = node.parts[i];
            if (AST.isOption(currentNode)) {
                const optionNode = currentNode;
                if (optionNode.opt === optionName) {
                    return optionNode;
                }
            }
            else if (AST.isStickyOption(currentNode)) {
                const composedOptionNode = currentNode;
                return AST.getCommandOption(composedOptionNode, optionName);
            }
        }
    }
    /**
     * Checks if a node is of kind command
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'command' else false
     */
    static isCommand(node) {
        return node.kind === "command";
    }
    /**
     * Checks if a node is of kind composedOption
     * @param node
     * @returns {boolean} true if kind is 'composedOption'
     */
    static isStickyOption(node) {
        return node.kind === "stickyOption";
    }
    /**
     * Checks if a node is of kind list
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'list' else false
     */
    static isList(node) {
        return node.kind === "list";
    }
    /**
     * Checks if a node is of kind pipeline
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'pipeline' else false
     */
    static isPipeline(node) {
        return node.kind === "pipeline";
    }
    /**
     * Checks if node is of kind assignment
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'assignment'
     */
    static isAssignment(node) {
        return node.kind === "assignment";
    }
    /**
     * Checks if a node is of kind word
     * @param node {NodeASt}
     * @returns {boolean} true if kind is 'word'
     */
    static isWord(node) {
        return node.kind === "word";
    }
    static isOptionWithArg(node) {
        return node.kind === "optionWithArg";
    }
    /**
     * Checks if node is of kind operator
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'operator
     */
    static isOperator(node) {
        return node.kind === "operator";
    }
    /**
     * Checks if node is of kind pipe
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'operator'
     */
    static isPipe(node) {
        return node.kind === "pipe";
    }
    /**
     * Checks if node is of kind reservedWord
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'reservedWord'
     */
    static isReservedWord(node) {
        return node.kind === "reservedword";
    }
    /**
     * Checks if a node is of kind redirect
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'redirect'
     */
    static isRedirect(node) {
        return node.kind === "redirect";
    }
    /**
     * Checks if a node is of kind option
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'option'
     */
    static isOption(node) {
        return node.kind === "option";
    }
    /**
     * Checks if a node is of kind argument
     * @param node {NodeAST}
     * @returns {boolean} true if kind is 'argument'
     */
    static isArgument(node) {
        return node.kind === "argument";
    }
    /**
     * Checks if a node is of kind compound
     * @param node
     */
    static isCompound(node) {
        return node.kind === "compound";
    }
    /**
     * Checks if a node is of kind subcommand
     * @param node {NodeAST}
     * @returns true if kind is 'subcommand'
     */
    static isSubcommand(node) {
        return node.kind === "subcommand";
    }
    /**
     * Checks if a node is of kind program
     * @param node {NodeAST}
     * @returns true if kind is 'program'
     */
    static isProgram(node) {
        return node.kind === "program";
    }
    /**
     * Checks if a node word is "sudo".
     */
    static isSudo(node) {
        return node.word === "sudo";
    }
    /**
     * Checks if an option expects an argument, based on a OptionSchema
     * definition
     * @param node
     */
    static optionExpectsArg(node) {
        if (!node.optionSchema)
            return false;
        return node.optionSchema.expectsArg || false;
    }
    /**
     * Checks if an OptionNodeAST is followed immediately by an argument
     * @param node the OptionNodeAST to validate
     * @returns true if it's followed by an argument
     */
    static optionFollowedByArg(node) {
        return node.followedByArg || false;
    }
    static withSudo(node) {
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
    static serialize(str) {
        try {
            return JSON.parse(str);
        }
        catch (err) {
            throw err;
        }
    }
    static flatten(node) {
        if (!node.parts) {
            return [];
        }
        if (AST.isCommand(node)) {
            return AST.flattenCommandNode(node);
        }
        else if (AST.isList(node)) {
            return AST.flattenListNode(node);
        }
        return [];
    }
    static flattenCommandNode(node) {
        let flat = [];
        for (const part of node.parts) {
            if (AST.isProgram(part) ||
                AST.isSubcommand(part) ||
                AST.isAssignment(part) ||
                AST.isOption(part) ||
                AST.isArgument(part)) {
                flat = [...flat, part];
            }
            else if (part.parts && AST.isStickyOption(part)) {
                flat = [...flat, ...part.parts];
            }
        }
        return flat;
    }
    static flattenListNode(node) {
        if (!node.parts) {
            return [];
        }
        let flat = [];
        for (const part of node.parts) {
            if (AST.isCommand(part)) {
                const flatCommandNode = AST.flattenCommandNode(part);
                flat = [...flat, ...flatCommandNode];
            }
            if (AST.isOperator(part)) {
                flat = [...flat, part];
            }
        }
        return flat;
    }
}
exports.default = AST;
//# sourceMappingURL=ast.js.map