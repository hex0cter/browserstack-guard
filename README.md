# Browserstack guard
[![npm version](https://badge.fury.io/js/browserstack-guard.svg)](https://badge.fury.io/js/browserstack-guard) [![Build Status](https://travis-ci.org/hex0cter/browserstack-guard.svg?branch=master)](https://travis-ci.org/hex0cter/browserstack-guard)

A cli command checking the available executors on your browserstack subscription.

## Background
Browserstack supports limited number of queued tasks. If you run a test when the queue is already full, the test will fail. This command helps you check if it is possible to run a new test. If you have reached the upper limit of allowed parallel tests, the command will wait until an executor becomes available.

## Install
Just install the package as a global package on your system
```
npm install -g browserstack-guard
```

## How to use
Before you run any test on browserstack, run the following command:
```
browserstack-guard --username <user name> --accesskey <access key>
```
or
```
BROWSERSTACK_USERNAME=<user name> BROWSERSTACK_ACCESS_KEY=<access key> browserstack-guard
```
This could be very handy to run before you start any automated test in the build pipeline.

## Contributing
Pull requests are welcome for fixing issues or adding more features. Things that could be useful are unit tests and more safety nets for when something goes wrong.
