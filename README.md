# kmdr.sh

The CLI client for explaining shell commands.

## Installation

### With yarn

```bash
yarn global add kmdr
```

### With npm

```bash
npm install kmdr --global
```

## Usage

### Explain a command

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
