# kmdr.sh

The CLI client for explaining complex shell commands.

kmdr provides command explanations for hundreds of programs including `git`, `docker`, `kubectl`,`npm`, `go` and more straight forward programs such as those built into `bash`.

## Requirements
- Node.js v12.6.0 https://nodejs.org/en/
- A package manager like yarn or npm

## Installation

### With yarn

```bash
yarn global add kmdr@latest
```

### With npm

```bash
npm install kmdr --global
```

## Check installation
```
$ kmdr
Usage: kmdr [options] [command]

Explain a command

Options:
  -v, --version  output the version number
  -h, --help     output usage information

Commands:
  explain|e      Explain a shell command
```

### Troubleshooting installation

#### `Command not found: kmdr`

Add the line below to your `.bashrc` or `.zshrc` if using `zsh`

```
export PATH="$(yarn global bin):$PATH"
```


###


## Usage

### Explain a command

Once kmdr is installed on your system, enter `kmdr explain` to return a prompt for entering the command you would like explained.

When the `Enter your command:` prompt is returned, enter the command you would like explained and hit the `Enter` key.

kmdr will return syntax highlighting to assist you in differentiating parts of the command followed by the explanation of each of these parts.

An example explanation of `git commit -am "Initial commit"` can be seen below.

```bash
$ kmdr explain
👋 Hi, welcome to kmdr!
This CLI program explains shell commands right on your terminal!

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

We add new programs every day!

`cat`, `cd`,`cp`, `curl`, `cut`,`df`,`docker`,`docker-compose`,`du`, `echo`, `false`, `find`, `free`, `gcc`, `git`, `go`, `grep`, `head`, `hostname`, `journalctl`, `kmdr`, `kubectl`, `less`, `ls`, `md5sum`, `mkdir`, `mv`, `netstat`, `node`, `now`, `npm`, `openssl`, `ping`, `pip`, `python`, `rm`, `rmdir`, `rsync`, `scp`, `sort`, `sqlite3`, `ssh`, `ssh-add`, `ssh-keygen`, `sudo`, `tail`, `tar`, `top`, `true`, `uniq`, `wc`, `wget`,`yarn`

## Stay tuned for more updates

Follow us on twitter http://twitter.com/kmdr_sh
