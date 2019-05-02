#!/usr/bin/env node

const yargs = require('yargs')
const browserstackGuard = require('./')

const args = yargs.option('username', {
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
  .argv

browserstackGuard(args.username, args.accesskey, args.limit)
