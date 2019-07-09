# kmdr.sh

The CLI client for explaining shell commands.

## Installation

```bash
yarn global add kmdr
```

```bash
npm install kmdr --global
```

## Usage

```bash
$ kmdr explain
⌨️ Explain a command: rm -rf /

💥 Syntax Highlighting
  rm -rf /

💡 Explanation
  rm: remove files or directories
  -r, -R, --recursive: remove directories and their contents recursively
  -f, --force: ignore nonexistent files and arguments, never prompt
  /: an argument
```

## Schemas

A schema is the machine-readable structure used by kmdr for organizing command descriptions.

Every program explained by kmdr has a schema with key-value pairs defining the properties of commands. There are three sets of key-value pairs which make up a schema: program, subcommand, and option. Some programs do not have subcommands or/nor options.

## Program key-value pairs

The basis of a schema is its program key-value pairs. Information about the key-value pairs <available> for a CLI program is described in Table 1.0 with `yarn` as the example program.

| Key-value pair | Definition                            | Required | Type     | Sample value |
| -------------- | ------------------------------------- | -------- | -------- | ------------ |
| `name`         | The name of the program or subcommand | Yes      | `string` | "git"        |
