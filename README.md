Export Wins MI
==============

A front end project to show some MI data for Export Wins

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

To run in development mode (watching files for changes):

```bash
npm run watch
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
