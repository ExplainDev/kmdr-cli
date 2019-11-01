# kmdr.sh ![npm](https://img.shields.io/npm/v/kmdr?color=green&style=flat-square)![npm](https://img.shields.io/npm/dt/kmdr?color=blue&style=flat-square)

> The CLI client for explaining commands from your terminal

<p align="center">
  <img src="screenshot.png">
</p>

`kmdr` provides command explanations for hundreds of programs including `git`, `docker`, `kubectl`,`npm`, `go` and more straight forward programs such as those built into `bash`.

## Installation

### Requirements

- Node.js v8.x and above
- A package manager like `npm` or `yarn`

#### With `npm`

```bash
npm install kmdr@latest --global
```

#### With `yarn`

```bash
yarn global add kmdr@latest
```

#### With Homebrew 🍺 (only macOS)

```bash
brew install kommandr/tap/kmdr
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
$ kmdr feedback                                                                                                                                                   README*
? How can we help? Support for printing explanantions with different colors :)
? Email address: eddie@kmdr.sh
✔ Your feedback was saved. Thank you!
```

### Supported programs

We add new programs every day.

#### Bash/Bourne Shell Builtins

| Program    | Options/flags coverage | Subcommands coverage |
| ---------- | ---------------------- | -------------------- |
| `cd`       | -                      |                      |
| `clear`    | -                      |                      |
| `command`  | -                      |                      |
| `disdown`  | -                      |                      |
| `pwd`      | -                      |                      |
| `readonly` | -                      |                      |
| `sleep`    | -                      |                      |
| `true`     | -                      |                      |

#### Containers

| Program          | Options/flags coverage | Subcommands coverage |
| ---------------- | ---------------------- | -------------------- |
| `docker`         | yes                    | partial              |
| `docker-compose` | yes                    | partial              |
| `dmesg`          | yes                    | -                    |
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

| Program            | Options/flags coverage | Subcommands coverage |
| ------------------ | ---------------------- | -------------------- |
| `now`              | yes                    | partial              |
| `ansible`          | yes                    | partial              |
| `ansible-playbook` | yes                    | partial              |

#### File and Archiving

| Program    | Options/flags coverage | Subcommands coverage |
| ---------- | ---------------------- | -------------------- |
| `basename` | yes                    | -                    |
| `chgrp`    | yes                    | -                    |
| `chown`    | yes                    | -                    |
| `chmod`    | yes                    | -                    |
| `cmp`      | yes                    | -                    |
| `cp`       | yes                    | -                    |
| `dd`       | yes                    | -                    |
| `df`       | yes                    | -                    |
| `file`     | yes                    | -                    |
| `find`     | yes                    | -                    |
| `gunzip`   | yes                    | -                    |
| `gzip`     | yes                    | -                    |
| `ln`       | yes                    |                      |
| `ls`       | yes                    | -                    |
| `mkdir`    | yes                    | -                    |
| `mktemp`   | yes                    | -                    |
| `more`     | yes                    | -                    |
| `mv`       | yes                    | -                    |
| `openssl`  | yes                    | partial              |
| `realpath` | yes                    | -                    |
| `rm`       | yes                    | -                    |
| `rmdir`    | yes                    | -                    |
| `rsync`    | yes                    | -                    |
| `scp`      | yes                    | -                    |
| `split`    | yes                    | -                    |
| `stat`     | yes                    | -                    |
| `tar`      | yes                    | -                    |
| `touch`    | yes                    | -                    |
| `tree`     | yes                    | -                    |
| `unmask`   | yes                    | -                    |
| `watch`    | yes                    | -                    |

#### Media (audio/video)

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `ffmpeg`     | yes                    | -                    |
| `youtube-dl` | yes                    | -                    |

#### Network/Communication

| Program       | Options/flags coverage | Subcommands coverage |
| ------------- | ---------------------- | -------------------- |
| `dig`         | yes                    | -                    |
| `host`        | yes                    | -                    |
| `iptables`    | yes                    | -                    |
| `ifconfig`    | yes                    | -                    |
| `hostname`    | yes                    | -                    |
| `netstat`     | yes                    | -                    |
| `nmap`        | yes                    | -                    |
| `nslookup`    | yes                    | -                    |
| `ping`        | yes                    | -                    |
| `ss`          | yes                    | -                    |
| `ssh`         | yes                    | -                    |
| `ssh-add`     | yes                    | -                    |
| `ssh-copy-id` | yes                    | -                    |
| `ssh-keygen`  | yes                    | -                    |
| `tcpdump`     | yes                    | -                    |
| `telnet`      | yes                    | -                    |
| `traceroute`  | yes                    | -                    |

#### Package managers

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `apt`        | yes                    | -                    |
| `cargo`      | yes                    | -                    |
| `dpkg`       | yes                    | -                    |
| `dpkg-query` | yes                    | -                    |
| `gem`        | yes                    | -                    |
| `npm`        | yes                    | yes                  |
| `yarn`       | yes                    | yes                  |

#### Programming Languages / Run time environments / Compilers

| Program      | Options/flags coverage | Subcommands coverage |
| ------------ | ---------------------- | -------------------- |
| `du`         | yes                    | -                    |
| `gcc`        | yes                    | -                    |
| `go`         | yes                    | partial              |
| `node`       | yes                    | -                    |
| `pip`        | yes                    | yes                  |
| `perl`       | no                     | -                    |
| `python`     | yes                    | -                    |
| `ruby`       | yes                    | -                    |
| `virtualenv` | yes                    | -                    |

#### Sysadmin / Monitoring

| Program       | Options/flags coverage | Subcommands coverage |
| ------------- | ---------------------- | -------------------- |
| `adduser`     | yes                    | -                    |
| `chroot`      | yes                    | -                    |
| `chsh`        | yes                    | -                    |
| `crontab`     | yes                    | -                    |
| `df`          | yes                    | -                    |
| `free`        | yes                    | -                    |
| `fusermount`  | yes                    | -                    |
| `groupadd`    | yes                    | -                    |
| `halt`        | yes                    | -                    |
| `htop`        | yes                    | -                    |
| `install`     | yes                    | -                    |
| `iperf`       | yes                    | -                    |
| `iperf3`      | yes                    | -                    |
| `jobs`        | yes                    | -                    |
| `journalctl`  | yes                    | -                    |
| `kill`        | yes                    | -                    |
| `killall`     | yes                    | -                    |
| `lsmod`       | yes                    | -                    |
| `lsof`        | yes                    | -                    |
| `lsb_release` | yes                    | -                    |
| `mount`       | yes                    | -                    |
| `nice`        | yes                    | -                    |
| `nohup`       | yes                    | -                    |
| `nproc`       | yes                    | -                    |
| `ps`          | yes                    | -                    |
| `shutdown`    | yes                    | -                    |
| `sudo`        | yes                    | -                    |
| `systemctl`   | yes                    | -                    |
| `top`         | yes                    | -                    |
| `uname`       | yes                    | -                    |
| `visudo`      | yes                    | -                    |
| `which`       | yes                    | -                    |
| `who`         | yes                    | -                    |
| `whoami`      | yes                    | -                    |

#### Time/Date

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `cal`   | -                      | -                    |
| `date`  | -                      | -                    |
| `time`  | -                      | -                    |

#### Text Processing

| Program  | Options/flags coverage | Subcommands coverage |
| -------- | ---------------------- | -------------------- |
| `awk`    | -                      | -                    |
| `cat`    | yes                    | -                    |
| `column` | yes                    | -                    |
| `cut`    | yes                    | -                    |
| `diff`   | yes                    | -                    |
| `egrep`  | yes                    | -                    |
| `grep`   | yes                    | -                    |
| `head`   | yes                    | -                    |
| `less`   | yes                    | -                    |
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
| `vi`    | -                      | -                    |
| `vim`   | -                      | -                    |

#### Task Runner

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `gulp`  | yes                    | -                    |

#### Utilities

| Program     | Options/flags coverage | Subcommands coverage |
| ----------- | ---------------------- | -------------------- |
| `apt-get`   | yes                    | -                    |
| `autossh`   | yes                    | -                    |
| `base64`    | yes                    | -                    |
| `curl`      | yes                    | -                    |
| `echo`      | yes                    |                      |
| `env`       | yes                    | -                    |
| `export`    | yes                    |                      |
| `false`     | yes                    | -                    |
| `gofmt`     | yes                    | -                    |
| `history`   | yes                    |                      |
| `id`        | yes                    | -                    |
| `jq`        | yes                    | -                    |
| `kmdr`      | yes                    | yes                  |
| `md5sum`    | yes                    | -                    |
| `openssl`   | yes                    | partial              |
| `pandoc`    | yes                    | -                    |
| `printf`    | yes                    | -                    |
| `read`      | yes                    | -                    |
| `screen`    | yes                    | -                    |
| `seq`       | yes                    | -                    |
| `sha1sum`   | yes                    | -                    |
| `sha256sum` | yes                    | -                    |
| `strings`   | yes                    | -                    |
| `timeout`   | yes                    | -                    |
| `uptime`    | yes                    | -                    |
| `wget`      | yes                    | -                    |
| `whereis`   | yes                    | -                    |

#### Virtualization

| Program   | Options/flags coverage | Subcommands coverage |
| --------- | ---------------------- | -------------------- |
| `vagrant` | yes                    | -                    |

#### Version Control

| Program | Options/flags coverage | Subcommands coverage |
| ------- | ---------------------- | -------------------- |
| `hg`    | yes                    | -                    |

#### Miscellaneous

| Program   | Options/flags coverage | Subcommands coverage |
| --------- | ---------------------- | -------------------- |
| `bash`    | yes                    | -                    |
| `bash/sh` | yes                    | -                    |
| `conda`   | yes                    | -                    |
| `dh`      | yes                    | -                    |
| `fuser`   | yes                    | -                    |
| `gpg`     | yes                    | -                    |
| `gpart`   | yes                    | -                    |
| `header`  | yes                    | -                    |
| `lsblk`   | yes                    | -                    |
| `logout`  | yes                    | -                    |
| `nc`      | yes                    | -                    |
| `pv`      | yes                    | -                    |
| `tty`     | yes                    | -                    |
| `tcsh`    | yes                    | -                    |
| `useradd` | yes                    | -                    |
| `whois`   | yes                    | -                    |

## Stay tuned for more updates

- Visit our website <https://kmdr.sh/>
- Follow us on twitter <http://twitter.com/kmdr_sh>
