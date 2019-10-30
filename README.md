# kmdr.sh ![npm](https://img.shields.io/npm/v/kmdr?color=green&style=flat-square)![npm](https://img.shields.io/npm/dt/kmdr?color=blue&style=flat-square)

> The CLI client for explaining commands from your terminal

<p align="center">
  <img src="kmdr-explain.gif">
</p>

`kmdr` provides command explanations for hundreds of programs including `git`, `docker`, `kubectl`,`npm`, `go` and more straight forward programs such as those built into `bash`.

## Installation

### Requirements

- Node.js v8.x and above
- A package manager like `yarn` or `npm`

### With yarn

```bash
yarn global add kmdr@latest
```

### With npm

```bash
npm install kmdr@latest --global
```

### Check installation

Run the command `kmdr` to check if it was correctly installed on your system.

```
$ kmdr
Usage: kmdr [options] [command]

The CLI client for explaining complex shell commands.

kmdr provides command explanations for hundreds of programs including git, docker, kubectl,npm, go and more straight forward programs such as those built into bash.

Options:
  -v, --version        output the version number
  -h, --help           output usage information

Commands:
  explain|e [options]  Explain a shell command
  upgrade|u            Check for newer releases
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

  Explanation
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

  Related Programs
    hg, lsof, systemctl, aria2c, dmesg, make
```

### Examples

#### Explaining commands with subcommands

```
$ kmdr explain
? Enter your command: sudo npm install kmdr@latest --global

  ? Enter your command: sudo npm install kmdr@latest --global

    sudo npm install kmdr@latest --global

  Explanation
    sudo
      Execute a command with the privileges of a different user without switching environments
    npm
      javascript package manager
    install
      Install a package
    kmdr@latest
      An operand
    -g, --global
      Argument will cause npm to install the package globally rather than locally.

  Related Programs
    dpkg, pip, gem, node, cargo, install, systemctl
```

#### Explanining commands with grouped options

```
$ kmdr explain
? Enter your command: rsync -anv file1 file2

    rsync -anv file1 file2

  Explanation
    rsync
      A fast, versatile, remote (and local) file-copying tool
    -a, --archive
      This is equivalent to -rlptgoD.
    -n, --dry-run
      This makes rsync perform a trial run that doesn’t make any changes (and produces mostly the same output as a real run).
    -v, --verbose
      This option increases the amount of information you are given during the transfer.
    file1
      An operand
    file2
      An operand

  Related Programs
    ssh, ssh-copy-id, hostname, ansible-playbook, ansible, scp, lxc
```

#### Explaining commands with redireciton

```
$ kmdr explain
? Enter your command: ls -alh > contents.txt

    ls -alh > contents.txt

  Explanation
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

  Related Programs
    dir, sort, pwd, tree, find, mkdir, rmdir
```

#### Explaining list of commands

```
$ kmdr explain
? Enter your command: dmesg | grep 'usb' > output.log 2>error.log

    dmesg | grep 'usb' > output.log 2> error.log

  Explanation
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

  Related Programs
    ifconfig, systemctl, iptables, make, git, ssh, passwd, nl, uniq, paste, sort, tee, base32, base64
```

### Sending feedback

```
$ kmdr feedback                                                                                                                                                   README*
? How can we help? Support for printing explanantions with different colors :)
? Email address: eddie@kmdr.sh
✔ Your feedback was saved. Thank you!
```

### Checking for updates

```
$ kmdr upgrade                                                                                                                                                    README*
  You have the latest version of kmdr-cli
```

## Supported programs

We add new programs every day!

### Bash/Bourne Shell Builtins

- `bg`
- `cd`
- `clear`
- `command`
- `echo`
- `eval`
- `false`
- `fg`
- `history`
- `jobs`
- `kill`
- `printf`
- `pwd`
- `read`
- `readonly`
- `sleep`
- `true`
- `umask`

### Containers

- `docker`
- `docker-compose`
- `dmesg`
- `kubectl`
- `singularity`

### Database server and clients

- `mongod`
- `mongodump`
- `mysql`
- `mysqldump`
- `pg_ctl`
- `pg_dump`
- `pg_restore`
- `sqlite3`

### Deployment / Cloud

- `now`
- `ansible`
- `ansible-playbook`

### File and Archiving

- `basename`
- `chgrp`
- `chown`
- `chmod`
- `cmp`
- `cp`
- `dd`
- `df`
- `du`
- `file`
- `find`
- `gunzip`
- `gzip`
- `ln`
- `ls`
- `mkdir`
- `mktemp`
- `more`
- `mv`
- `openssl`
- `realpath`
- `rm`
- `rmdir`
- `rsync`
- `scp`
- `split`
- `stat`
- `tar`
- `touch`
- `tree`
- `unmask`
- `watch`

### Media (audio/video)

- `ffmpeg`
- `youtube-dl`

### Network/Communication

- `curl`
- `dig`
- `host`
- `iptables`
- `ifconfig`
- `hostname`
- `netstat`
- `nmap`
- `nslookup`
- `ping`
- `ssh`
- `ssh-add`
- `ssh-copy-id`
- `ssh-keygen`
- `tcpdump`
- `telnet`
- `traceroute`
- `wget`

### Package managers

- `apt`
- `cargo`
- `dpkg`
- `dpkg-query`
- `gem`
- `npm`
- `pip`
- `yarn`

### Programming Languages / Run time environments / Compilers

- `gcc`
- `go`
- `node`
- `perl`
- `python`
- `ruby`
- `virtualenv`

### Sysadmin / Monitoring

- `adduser`
- `chroot`
- `chsh`
- `crontab`
- `df`
- `free`
- `groupadd`
- `halt`
- `htop`
- `install`
- `iperf`
- `iperf3`
- `journalctl`
- `killall`
- `lsof`
- `lsb_release`
- `mount`
- `nice`
- `nohup`
- `nproc`
- `ps`
- `shutdown`
- `sudo`
- `systemctl`
- `top`
- `uname`
- `visudo`
- `which`
- `who`
- `whoami`

### Time/Date

- `cal`
- `date`
- `time`

### Text Processing

- `awk`
- `cat`
- `column`
- `cut`
- `diff`
- `grep`
- `head`
- `less`
- `nl`
- `od`
- `sed`
- `sort`
- `tail`
- `tr`
- `uniq`
- `wc`

### Text editors

- `code`
- `nano`
- `vi`
- `vim`

### Task Runner

- `gulp`

### Utilities

- `autossh`
- `base64`
- `env`
- `export`
- `gofmt`
- `id`
- `jq`
- `kmdr`
- `md5sum`
- `openssl`
- `pandoc`
- `screen`
- `seq`
- `sha1sum`
- `sha256sum`
- `strings`
- `timeout`
- `uptime`
- `whereis`

### Virtualization

- `vagrant`

### Version Control

- `git`
- `hg`

### Miscellaneous

- `bash`
- `bash/sh`
- `conda`
- `gpg`
- `lsblk`
- `tty`

## Stay tuned for more updates

- Visit our website <https://kmdr.sh/>
- Follow us on twitter <http://twitter.com/kmdr_sh>
