#!/usr/bin/env node

import yargs from 'yargs'
import browserstackGuard from './index'

const args = yargs
  .option('username', {
    alias: 'u',
    default: process.env.BROWSERSTACK_USERNAME || '',
    description: 'User name of your browserstack account'
  })
  .option('accesskey', {
    alias: 'k',
    default: process.env.BROWSERSTACK_ACCESS_KEY || '',
    description: 'Access key of your browserstack account'
  })
  .option('limit', {
    alias: 'l',
    default: 5,
    description: 'Number of parallel tests allowed in browerstack'
  })
  .option('verbose', {
    alias: 'v',
    description: 'Verbose mode'
  })
  .argv

if (args.username === '') {
  console.log('Missing user name. Please export BROWSERSTACK_USERNAME or run the command with `--username <username>`')
  process.exit(1)
}
if (args.accesskey === '') {
  console.log('Missing access key. Please export BROWSERSTACK_ACCESS_KEY or run the command with `--accesskey <accesskey>`')
  process.exit(1)
}

browserstackGuard(args.username, args.accesskey, args.limit, args.verbose)
