Export Wins MI
==============

A front end project to show some MI data for Export Wins

[![Build Status](https://circleci.com/gh/uktrade/export-wins-ui-mi.svg?style=shield)](https://circleci.com/gh/uktrade/export-wins-ui-mi)
[![Dependency Status](https://img.shields.io/gemnasium/uktrade/export-wins-ui-mi.svg?style=flat&label=dependencies)](https://gemnasium.com/github.com/uktrade/export-wins-ui-mi)

## Dependenies

All dependencies come from NPM

## Setup

After checkout run:

```bash
npm install
```

## Starting the app

To start the app in production:

```bash
npm start
```

This will use server.js to run the app as a child process, if the child process crashes then it will be respawned.

If the SERVER_WORKERS env variable is set to more than 1, it will use the cluster module and will spin up x amount of workers as specified.


To run just the app directly (not as a child process from server.js):

```bash
npm run app
```

### Development

To run in development mode (watching files for changes):

```bash
npm run watch
```

To run in development mode and also use fake stubs, first you need to generate the stubs:

```bash
node src/data/create-backend-fake-stubs.js
```

This should log a message to say how many files were written, now you can run the app with those stubs:

```bash
npm run watch-stub
```


## Testing

To test the Node code:

```bash
npm test
```

To test the client side code:

```bash
npm run test-client
```

# Docker

## Docker compose

To start all the services you can use docker compose:

```bash
docker-compose up
```

Which will require a database to be running and DATABASE_URL env var to be defined

To start a clean db, use with the over ride file:

```bash
docker-compose -f docker-compose.yml -f docker-compose.clean.yml up
```
