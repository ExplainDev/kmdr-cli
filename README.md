# kmdr-cli ![npm](https://img.shields.io/npm/v/kmdr?color=green&style=flat-square)![npm](https://img.shields.io/npm/dt/kmdr?color=blue&style=flat-square)

> The CLI tool for learning commands from your terminal

<p align="center">
  <img src="screenshot.png">
</p>

`kmdr` provides command explanations for hundreds of programs including `git`, `docker`, `kubectl`,`npm`, `go` and more straight forward programs such as those built into `bash`. See the full list at https://app.kmdr.sh/program.

## Installation

You will need to install the kmdr program and sign-in to begin using kmdr on the CLI.

### Requirements

- Node.js v8.x and above
- A package manager like `npm` or `yarn`

#### With `npm`

```bash
npm install kmdr --global
```

#### With `yarn`

```bash
yarn global add kmdr
```

### Check installation

Run the command `kmdr` to check if it was correctly installed on your system.

```
$ kmdr
Usage: kmdr [options] [command]

The CLI tool for learning commands from your terminal

Learn more at https://kmdr.sh/

Options:
  -v, --version    output the version number
  -h, --help       output usage information

Commands:
  explain|e        Explain a shell command
  info|i           Display system-wide information
  login|l [email]  Log in to kmdr
  logout           Log out from kmdr
  settings|s       Adjust options and preferences
  version|v        Print current version and check for newer release
```

#### Troubleshooting installation

##### Command not found: kmdr

Add the line below to your `.bashrc` or `.zshrc` if using `zsh`

```
export PATH="$(yarn global bin):$PATH"
```

### Running `kmdr` in a docker container

1. Build the image

   ```bash
   docker build -t kmdr-cli .
   ```

2. Run the docker container

   ```bash
   docker run -it --rm  kmdr-cli
   ```

### Sign In

1. Log in on the kmdr CLI tool

```bash
kmdr login
```

2. Enter your email when prompted
3. Check your inbox and click on the link provided in the email.

## Usage

### Explain a command

Once `kmdr-cli` is installed on your system, enter `kmdr explain` to return a prompt for entering the command you would like explained.

When the `Enter your command:` prompt is returned, enter the command you would like explained and hit the `Enter` key.

`kmdr` will return syntax highlighting to assist you in differentiating parts of the command followed by the explanation of each of these parts.

An example explanation of `git commit -am "Initial commit"` can be seen below.

```
$ kmdr explain
✔ Enter your command · git commit -am "Initial Commit"

    git commit -am "Initial Commit"

  DEFINITIONS

    git
      The stupid content tracker
    commit
      Record changes to the repository
    -a, --all
      Tell the command to automatically stage files that have been modified and deleted
    -m, --message "Initial Commit"
      Use the given <msg> as the commit message
```

### Examples

#### Explaining commands with subcommands

```
$ kmdr explain
? Enter your command: npm install kmdr@latest --global

    npm install kmdr@latest --global

  DEFINITIONS

    npm
      Package manager for the Node JavaScript platform
    install
      Install a package
    kmdr@latest
      The CLI tool for learning commands from your terminal
    -g, --global
      Install the package globally rather than locally
```

#### Explanining commands with grouped options

```
$ kmdr explain
? Enter your command: rsync -anv file1 file2

    rsync -anv file1 file2

  DEFINITIONS

    rsync
      A fast, versatile, remote (and local) file-copying tool
    -a, --archive
      This is equivalent to -rlptgoD.
    -n, --dry-run
      This makes rsync perform a trial run that doesn’t make any changes
      (and produces mostly the same output as a real run).
    -v, --verbose
      This option increases the amount of information you are given during
      the transfer.
```

#### Explaining commands with redireciton

```
$ kmdr explain
? Enter your command: ls -alh > contents.txt

    ls -alh > contents.txt

  DEFINITIONS

    ls
      List directory contents
    -a, --all
      Do not ignore entries starting with .
    -l
      Use a long listing format
    -h, --human-readable
      With -l and/or -s, print human readable sizes (e.g., 1K 234M 2G)
    > contents.txt
      Redirect stdout to contents.txt.
```

#### Explaining list of commands

```
$ kmdr explain
? Enter your command: dmesg | grep 'usb' > output.log 2>error.log

    dmesg | grep 'usb' > output.log 2> error.log

  DEFINITIONS

    dmesg
      Print or control the kernel ring buffer
    |
      A pipe serves the sdout of the previous command as input (stdin) to the next one
    grep
      Print lines matching a pattern
    > output.log
      Redirect stdout to output.log.
    2> error.log
      Redirect stderr to error.log.
```

So what is the reason for signing in? why should it be included in CLI readme?

## Supported programs

We add new programs every day! See the full list here: https://app.kmdr.sh/program.

## Stay tuned for more updates

- Visit our website <https://kmdr.sh/>
- Follow us on twitter <http://twitter.com/kmdr_sh>
