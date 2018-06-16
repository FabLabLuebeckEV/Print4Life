# Readme

## TODO

* hookup tests with jasmine or mocha for nodets

## Requirements

* Node > 8.9.4
* MongoDB (or at least a server with it)

## Use Node-Debugger with VSCode

If you use this boilerplate with VSCode you can run the debugger for node with ```npm run api-dev``` and use the feature in the bottom line 'auto attach' when running 'Attach to NPM'. This auto attaches the debugger to the running npm process.

## Run the app

To run the app you need to run ```npm run api-dev``` and ```npm run ng-serve-dev```. The application will then run on localhost:4200 for the angular app and localhost:3000 for the node backend. These commands will rebuild the nodets and ng application on changed files.