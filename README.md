kmdr.sh
============

A CLI client to interact with Kommandr

## Installation
``` shell
npm install -g kommandr-cli
```

Generate a token on kommandr.com and put it in `~/.kommandrrc`
```
{
  "user": "your_username",
  "token": "your_token"
}
```
## Usage

``` shell
$ kommandr save
? Command: ls -al
? Title:  List all files in current directory
? Description: This command displays all existing files in the current working directory
Your Kommandr has been saved!
Go to http://kommandr.com:5000/qlGv1K
````

``` shell
$ kommandr search git
These are the coincidences:
- Reset last commit
  git reset git reset HEAD~
- Push changes to remote master branch
  git push origin master
```

## Development
This project is under heavy development. Not all features may behave as expected.
