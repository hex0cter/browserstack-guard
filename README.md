# Browserstack guard
A cli command checking the available executors on your browserstack subscription.

## Background
Browserstack supports limited number of queued tasks. If you run a test when the queue is already full, the test will fail. This command help you to check if it is possible to run a new test. If you have reached the upp limit of allowed parallel tests, the command will wait until an executor is available.

## Install
Just install the package as a global package on your system
```
npm install -g browserstack-guard
```

## How to use
Before you run any test on browserstack, run the following command:
```
BROWSERSTACK_USERNAME=<user name> BROWSERSTACK_ACCESS_KEY=<access key> browserstack-guard
```
or
```
browserstack-guard --username <user name> --accesskey <access key>
```
