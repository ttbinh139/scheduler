# Interview Scheduler

This Scheduler has been designed to allow users to book/reschedule/cancel appointments for a specific day from Monday to Friday between the hours of 12 pm -5 pm with limited slots for each day. The scheduler is Dynamic as the selection of interviewers varies depending on the day to reflect their availability. 
The Scheduler uses React for rendering client-side, storybook for component testing, Jest for unit testing, and Cypress for end-to-end testing.
The serverside and database were developed by Lighthouse Labs.

## Goal
Create a modern client application using the React view library.


## Screenshots
View all Appointments
![View all Appointments](https://github.com/ttbinh139/scheduler/blob/master/docs/appointments_view.png?raw=true)
Create/Edit Appointments
![Create/Edit Appointments](https://github.com/ttbinh139/scheduler/blob/master/docs/appointments_create-edit.png?raw=true)
Cancel Appointments
![Cancel Appointments](https://github.com/ttbinh139/scheduler/blob/master/docs/appointments_delete.png?raw=true)

## Setup

Install dependencies with `npm install`.

## API server

The Scheduler run with pre-deployed API server. To start, you need to download the API files from github, https://github.com/ttbinh139/scheduler-api the run `npm install` to install all dependencies. 

After that you can run it locally by command `npm start`. The API server will run at port 8001 that separate with the Scheduler. The Scheduler app will use this api as a database and get information from it.

To test the error message, you can run command `npm run error`

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
