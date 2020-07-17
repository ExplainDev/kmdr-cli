# kmdr-cli ![npm](https://img.shields.io/npm/v/kmdr?color=green&style=flat-square)![npm](https://img.shields.io/npm/dt/kmdr?color=blue&style=flat-square)

> The ultimate CLI learning tool for explaining commands from your terminal

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

The ultimate CLI learning tool for explaining commands from your terminal

kmdr provides command explanations for hundreds of programs including git,
docker, kubectl, npm, go and more straight forward programs such as bash builtins.

Options:
  -v, --version        output the version number
  -h, --help           output usage information

Commands:
  explain|e [options]  Explain a shell command
  upgrade|u            Check for new releases
  feedback|f           Send feedback :)
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
  ```kmdr login
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
? Enter your command: git commit -am "Initial commit"

    git commit -am "Initial commit"

  EXPLANATION
    git
      The stupid content tracker
    commit
      Record changes to the repository
    -a, --all
      Tell the command to automatically stage files that have been modified and deleted
    -m, --message Initial commit
      Use the given <msg> as the commit message

  EXAMPLES
    git reset HEAD~1
      Undo the most recent commit, keeping its changes in the filesystem

    git commit -m "Initial commit"
      Commit staged files to the repository with message "Initial commit"

    git log -n 3 --oneline
      Show only the first line of the last three commit messages

  RELATED PROGRAMS
    hg, lsof, systemctl, aria2c, dmesg, make
```

### Examples

#### Explaining commands with subcommands

```
$ kmdr explain
? Enter your command: npm install kmdr@latest --global

    npm install kmdr@latest --global

  EXPLANATION
    npm
      javascript package manager
    install
      Install a package
    kmdr@latest
      An operand
    -g, --global
      Argument will cause npm to install the package globally rather than locally.

  EXAMPLES
    npm install kmdr@latest --global
      Install kmdr on your machine

    npm install
      Download all the packages listed as dependencies in package.json

    npm list -g --depth=0
      List all top-level globally installed modules on the system

  RELATED PROGRAMS
    dpkg, pip, gem, node, cargo, install
```

#### Explanining commands with grouped options

```
$ kmdr explain
? Enter your command: rsync -anv file1 file2

    rsync -anv file1 file2

  EXPLANATION
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
    file1
      An operand
    file2
      An operand

  EXAMPLES
    rsync -av --progress sourceDir user@host:remotedDir
      Synchronize the remote folder "remoteDir" with directory "sourceDir"
      including file permissions and ownership

    rsync -ru remoteHost:remoteDir localDir
      Synchronize only updated files from remote host

  RELATED PROGRAMS
    ssh, ssh-copy-id, hostname, ansible-playbook, ansible, scp
```

#### Explaining commands with redireciton

```
$ kmdr explain
? Enter your command: ls -alh > contents.txt

    ls -alh > contents.txt

  EXPLANATION
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

  EXAMPLES
    ls -a
      List all files, including hidden files

    ls -lh
      Long format list with size displayed using human readable
      units (KB, MB, GB)

    ls -lS
      Long format list sorted by size (descending)

  RELATED PROGRAMS
    dir, sort, pwd, tree, find, mkdir
```

#### Explaining list of commands

```
$ kmdr explain
? Enter your command: dmesg | grep 'usb' > output.log 2>error.log

    dmesg | grep 'usb' > output.log 2> error.log

  EXPLANATION
    dmesg
      Print or control the kernel ring buffer
    |
      A pipe serves the sdout of the previous command as input (stdin) to the next one
    grep
      Print lines matching a pattern
    usb
      An operand
    > output.log
      Redirect stdout to output.log.
    2> error.log
      Redirect stderr to error.log.

  EXAMPLES
    Could not find any example

  RELATED PROGRAMS
    ifconfig, systemctl, iptables, ssh, nl, uniq, paste, sort,
```

### Sending feedback

```
$ kmdr feedback
? How can we help? Support for printing explanantions with different colors :)
? Email address: eddie@kmdr.sh
✔ Your feedback was saved. Thank you!
```

### Checking for updates

```
$ kmdr upgrade
  You have the latest version of kmdr-cli
```

So what is the reason for signing in? why should it be included in CLI readme?
## Supported programs

We add new programs every day! See the full list here: https://app.kmdr.sh/program. 

## Stay tuned for more updates

- Visit our website <https://kmdr.sh/>
- Follow us on twitter <http://twitter.com/kmdr_sh>
