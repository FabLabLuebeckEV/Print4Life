# Readme

## TODO

* add [prettier](https://github.com/prettier/prettier) to support code-style formatting through IDE

## Requirements

* Node > 8.9.4
* MongoDB (or at least a server with it)

## Features

* skeleton for the MEAN framework using Typescript
* using linters to support code-styling
* test frameworks setup for unit-testing on back- and frontend but also end-to-end tests

## Use Node-Debugger with VSCode

If you use this boilerplate with VSCode you can run the debugger for node with ```npm run api-dev``` and use the feature in the bottom line 'auto attach' when running 'Attach to NPM'. This auto attaches the debugger to the running npm process.

## Run the app

To run the app in dev mode you need to run ```npm run api-dev``` and ```npm run ng-dev```. The application will then run on localhost:4200 for the angular app and localhost:3000 for the node backend. These commands will rebuild the nodets and ng application on changed files. **Beaware that the backend server only starts when a debugger is attached to it**.

Otherwise run ```npm run serve``` to run the application in production mode.