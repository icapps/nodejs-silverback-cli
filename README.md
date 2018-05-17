silverback
==========

The Silverback Command Line

[![Version](https://img.shields.io/npm/v/silverback.svg)](https://npmjs.org/package/silverback)
[![CircleCI](https://circleci.com/gh/icapps/nodejs-silverback-cli/tree/master.svg?style=shield)](https://circleci.com/gh/icapps/nodejs-silverback-cli/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/icapps/nodejs-silverback-cli?branch=master&svg=true)](https://ci.appveyor.com/project/icapps/nodejs-silverback-cli/branch/master)
[![Codecov](https://codecov.io/gh/icapps/nodejs-silverback-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/icapps/nodejs-silverback-cli)
[![Downloads/week](https://img.shields.io/npm/dw/silverback.svg)](https://npmjs.org/package/silverback)
[![License](https://img.shields.io/npm/l/silverback.svg)](https://github.com/icapps/nodejs-silverback-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g silverback
$ silverback COMMAND
running command...
$ silverback (-v|--version|version)
silverback/0.0.0 darwin-x64 node-v8.9.1
$ silverback --help [COMMAND]
USAGE
  $ silverback COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`silverback hello [FILE]`](#silverback-hello-file)
* [`silverback help [COMMAND]`](#silverback-help-command)

## `silverback hello [FILE]`

describe the command here

```
USAGE
  $ silverback hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ silverback hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/icapps/nodejs-silverback-cli/blob/v0.0.0/src/commands/hello.ts)_

## `silverback help [COMMAND]`

display help for silverback

```
USAGE
  $ silverback help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v1.2.11/src/commands/help.ts)_
<!-- commandsstop -->
