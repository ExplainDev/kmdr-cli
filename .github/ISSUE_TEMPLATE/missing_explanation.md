# Report or suggest a missing explanation

To simply submit a request for an explanation to be created, please provide the
program and command missing, with program version if possible. To provide a
description/if you know the explanation which is missing, please contribute
using the schema template deleting what is not applicable.

Description schema example you can edit:

```yaml
---
name: kmdr
summary: CLI client for explaning shell commands
link: https://kmdr.sh
version: '0.1'
locale: en
options:
  - name: language
    short:
      - '-l'
    long:
      - '--language'
    summary: Set the language
    expectsArg: true
subcommands:
  - name: explain
    summary: Explain a command
    aliases:
      - e
  - name: config
    summary: Configure kmdr on this computer
    aliases:
      - c
```
