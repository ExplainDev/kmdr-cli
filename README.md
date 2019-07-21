# kmdr.sh

The CLI client for explaining complex shell commands.

kmdr provides command explanations for hundreds of programs including
```git```, ```docker```, ```kubectl```,```npm```, ```go``` and
more straight forward programs such as those built into ```bash```.

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

Once kmdr is installed on your system, enter ```kmdr explain``` to return
a prompt for entering the command you would like explained.

When the ```Explain a command:``` prompt is returned, enter the command
you would like explained and hit the ```Enter``` key.

kmdr will return ```Syntax Highlighting``` to assist you in differentiating
parts of the command followed by the explanation of each of these parts.

An example explanation of ```rm -rf /``` can be seen below.

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
