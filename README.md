# kmdr.sh ![npm](https://img.shields.io/npm/v/kmdr?color=green&style=flat-square)![npm](https://img.shields.io/npm/dt/kmdr?color=blue&style=flat-square)

**The CLI client for explaining shell commands from your terminal**

`kmdr` provides command explanations for hundreds of programs including `git`, `docker`, `kubectl`,`npm`, `go` and more straight forward programs such as those built into `bash`.

<p align="center">
  <img src="kmdr-explain.gif">
</p>

## Examples

### Explaining commands with subcommands

```
$ kmdr explain
💡 Enter your command: sudo npm install kmdr@latest --global

  sudo
    execute a command as another user
  npm
    javascript package manager
  install
    Install a package
  kmdr@latest
    An argument of the previous option
  -g, --global
    Argument will cause npm to install the package globally rather than locally.
```

### Explanining commands with grouped options

```
$ kmdr explain
💡 Enter your command: rsync -anv dir1 dir2

  rsync
    A fast, versatile, remote (and local) file-copying tool
  -a, --archive
    This is equivalent to -rlptgoD.
  -n, --dry-run
    This makes rsync perform a trial run that doesn’t make any changes (and produces mostly the same output as a real run).
  -v, --verbose
    This option increases the amount of information you are given during the transfer.
  dir1
    An argument
  dir2
    An argument
```

### Explaining commands with redireciton

```
$ kmdr explain
💡 Enter your command: ls -alh > contents.txt

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

### Explaining list of commands

```
$ kmdr explain
💡 Enter your command: cd git/ && git clone git@github.com:ediardo/kmdr.sh.git && git log

  cd
    Change working directory
  git/
    An argument of the previous option
  &&
    Command2 is executed if, and only if, command1 returns an exit status of zero

  git
    The stupid content tracker
  clone
    Clone a repository into a new directory
  git@github.com:ediardo/kmdr.sh.git
    An argument of the previous option
```

## Installation

### Requirements

- Node.js v8.x and above
- A package manager like `yarn` or `npm`

**With yarn**

```bash
yarn global add kmdr@latest
```

**With npm**

```bash
npm install kmdr --global
```

### Check installation

Run the command `kmdr` to check if it was correctly installed on your system.

```
$ kmdr
Usage: kmdr [options] [command]

The CLI client for explaining complex shell commands.

kmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.

Options:
  -v, --version  output the version number
  -h, --help     output usage information

Commands:
  explain|e      Explain a shell command
```

#### Troubleshooting installation

##### Command not found: kmdr

Add the line below to your `.bashrc` or `.zshrc` if using `zsh`

```
export PATH="$(yarn global bin):$PATH"
```

## Usage

### Explain a command

Once kmdr is installed on your system, enter `kmdr explain` to return a prompt for entering the command you would like explained.

When the `Enter your command:` prompt is returned, enter the command you would like explained and hit the `Enter` key.

kmdr will return syntax highlighting to assist you in differentiating parts of the command followed by the explanation of each of these parts.

An example explanation of `git commit -am "Initial commit"` can be seen below.

```bash
$ kmdr explain
💡 Enter your command:  git commit -am "Initial commit"

  git commit -am "Initial commit"

  git
    The stupid content tracker
  commit
    Record changes to the repository
  -a, --all
    Tell the command to automatically stage files that have been modified and deleted
  -m, --message
    Use the given <msg> as the commit message
  Initial commit
    An argument

🤖 Is this helpful? Yes
🔥 Awesome! What did you like about this explanation?
✔ Your feedback was saved. Thank you!
Learn more at https://github.com/ediardo/kmdr.sh
```

### Supported programs

We add new programs every day.

#### Bash/Bourne Shell Builtins

| Program   | Options/flags coverage | Subcommands coverage |
| --------- | ---------------------- | -------------------- |
| `cd`      | -                      |                      |
| `echo`    | yes                    |                      |
| `false`   | -                      | -                    |
| `export`  | yes                    |                      |
| `history` | yes                    |                      |
| `true`    | -                      | -                    |
| `pwd`     | yes                    | -                    |

#### Containers

| Program          | Options/flags coverage | Subcommands coverage |
| ---------------- | ---------------------- | -------------------- |
| `docker`         | yes                    | partial              |
| `docker-compose` | yes                    | partial              |
| `kubectl`        | yes                    | partial              |
| `singularity`    | yes                    | no                   |

#### Version Control

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `git`   | yes                    | partial              |

#### Database server and clients

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `mongod`     | yes                    | -                    |
| `mongodump`  | yes                    | -                    |
| `mysql`      | yes                    | -                    |
| `mysqldump`  | yes                    | -                    |
| `pg_ctl`     | yes                    | -                    |
| `pg_dump`    | yes                    | -                    |
| `pg_restore` | yes                    | -                    |
| `sqlite3`    | yes                    | -                    |

#### Deployment / Cloud

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `now`   | yes                    | partial              |

#### File and Archiving

| Program    | Options/flags coverage | Subcommands coverage |
| ---------- | ---------------------- | -------------------- |
| `basename` | yes                    | -                    |
| `chmod`    | yes                    | -                    |
| `cmp`      | yes                    | -                    |
| `cp`       | yes                    | -                    |
| `diff`     | yes                    | -                    |
| `df`       | yes                    | -                    |
| `du`       | yes                    | -                    |
| `file`     | yes                    | -                    |
| `find`     | yes                    | -                    |
| `gunzip`   | yes                    | -                    |
| `gzip`     | yes                    | -                    |
| `less`     | yes                    | -                    |
| `ln`       | yes                    |                      |
| `ls`       | yes                    | -                    |
| `md5sum`   | yes                    | -                    |
| `mkdir`    | yes                    | -                    |
| `mktemp`   | yes                    | -                    |
| `more`     | yes                    | -                    |
| `mv`       | yes                    | -                    |
| `openssl`  | yes                    | partial              |
| `rm`       | yes                    | -                    |
| `rmdir`    | yes                    | -                    |
| `tar`      | yes                    | -                    |
| `touch`    | -                      | -                    |
| `watch`    | yes                    | -                    |
| `whereis`  | yes                    | -                    |

#### Media (audio/video)

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `ffmpeg`     | yes                    | -                    |
| `youtube-dl` | yes                    | -                    |

#### Network/Communication

| Program       | Options/flags coverage | Subcommands coverage |
| ------------- | ---------------------- | -------------------- |
| `curl`        | yes                    | -                    |
| `host`        | yes                    | -                    |
| `hostname`    | yes                    | -                    |
| `netstat`     | yes                    | -                    |
| `nmap`        | yes                    | -                    |
| `nslookup`    | yes                    | -                    |
| `ping`        | yes                    | -                    |
| `wget`        | yes                    | -                    |
| `rsync`       | yes                    | -                    |
| `ssh`         | yes                    | -                    |
| `ssh-add`     | yes                    | -                    |
| `ssh-copy-id` | yes                    | -                    |
| `ssh-keygen`  | yes                    | -                    |
| `scp`         | yes                    | -                    |

#### Package managers

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `dpkg`  | yes                    | -                    |
| `npm`   | yes                    | partial              |
| `pip`   | yes                    | yes                  |
| `yarn`  | yes                    | partial              |

#### Programming Languages / Run time environments / Compilers

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `gcc`        | yes                    | -                    |
| `go`         | yes                    | partial              |
| `node`       | yes                    | -                    |
| `perl`       | no                     | -                    |
| `python`     | yes                    | -                    |
| `virtualenv` | yes                    | -                    |

#### Sysadmin / Monitoring

| Program       | Options/flags coverage | Subcommands coverage |
| ------------- | ---------------------- | -------------------- |
| `crontab`     | yes                    | -                    |
| `dmesg`       | yes                    | -                    |
| `env`         | yes                    | -                    |
| `free`        | yes                    | -                    |
| `id`          | yes                    | -                    |
| `iperf`       | yes                    | -                    |
| `iperf3`      | yes                    | -                    |
| `journalctl`  | yes                    | -                    |
| `killall`     | yes                    | -                    |
| `lsb_release` | yes                    | -                    |
| `nice`        | yes                    | -                    |
| `ps`          | yes                    | -                    |
| `sudo`        | yes                    | -                    |
| `top`         | yes                    | -                    |
| `uname`       | yes                    | -                    |
| `who`         | yes                    | -                    |
| `whoami`      | yes                    | -                    |

#### Time/Date

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `date`  | -                      | -                    |
| `time`  | -                      | -                    |

#### Text Processing

| Program  | Options/flags coverage | Subcommands coverage |
| -------- | ---------------------- | -------------------- |
| `awk`    | -                      | -                    |
| `cat`    | yes                    | -                    |
| `column` | yes                    | -                    |
| `cut`    | yes                    | -                    |
| `grep`   | yes                    | -                    |
| `head`   | yes                    | -                    |
| `nl`     | yes                    | -                    |
| `od`     | yes                    | -                    |
| `sed`    | yes                    | -                    |
| `sort`   | yes                    | -                    |
| `tail`   | yes                    | -                    |
| `tr`     | yes                    | -                    |
| `uniq`   | yes                    | -                    |
| `wc`     | yes                    | -                    |

#### Text editors

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `code`  | -                      | -                    |
| `nano`  | -                      | -                    |
| `vim`   | -                      | -                    |

#### Utilities

| Program  | Options/flags coverage | Subcommands coverage |
| -------- | ---------------------- | -------------------- |
| `jq`     | yes                    | -                    |
| `kmdr`   | yes                    | yes                  |
| `pandoc` | yes                    | -                    |
| `tree`   | yes                    | -                    |

#### Miscellaneous

| Program   | Options/flags coverage | Subcommands coverage |
| --------- | ---------------------- | -------------------- |
| `base64`  | yes                    | -                    |
| `bash`    | yes                    | -                    |
| `chgrp`   | yes                    | -                    |
| `openssl` | yes                    | partial              |
| `timeout` | yes                    | -                    |

## Stay tuned for more updates

- Visit our website https://kmdr.sh/
- Follow us on twitter http://twitter.com/kmdr_sh
