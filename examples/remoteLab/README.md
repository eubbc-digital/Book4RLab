# RemoteLab

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.10.

A remote lab is a laboratory located in a remote location that can be accessed over the internet from anywhere. The remote lab example project provides a web-based interface for accessing a remote lab.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Running docker-compose

Run `docker-compose up --build` to build a remote lab example on port 4300.

Navigate to http://localhost:4300 in your web browser to visualize a basic UI for the remote lab.

## Remote lab example

This project contains an example of how the remote lab looks like. After a student has made a booking to use the remote lab, they can access a webpage where the remote lab is located.

## Features

The page shows different spaces, from a camera visualization of the experiment and various control options, to a chart where obtained data can be shown. This allows the student to view in real-time results, allowing a better understanding of the underlying principles.

## Lab timer

Since the remote labs are accessed within a timeframe, a countdown timer can be found at the top of the page. The timer will show the remaining time the student has until their booking ends. If the timer reaches zero, the student will be logged out of the remote lab.


## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
