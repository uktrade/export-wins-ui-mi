Export Wins MI
==============

A front end project to show some MI data for Data Hub

[![Build Status](https://circleci.com/gh/uktrade/export-wins-ui-mi.svg?style=shield)](https://circleci.com/gh/uktrade/export-wins-ui-mi)
[![Dependency Status](https://img.shields.io/gemnasium/uktrade/export-wins-ui-mi.svg?style=flat&label=dependencies)](https://gemnasium.com/github.com/uktrade/export-wins-ui-mi)

## Dependenies

All dependencies come from NPM

## Setup

After checkout run:

```bash
npm install
```

You will also need some environment variables created before you can start the app, take a look at the [env template](.env.template) file.

To make life easier setup an shell extension to read a .env or .envrc file and setup env vars for you, like [direnv](https://direnv.net/), then ensure you have the correct env variables set.

## Starting the app

### Production

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

#### Fake stubs

To run in development mode and also use fake stubs, first you need to generate the stubs:

```bash
node src/data/create-backend-fake-stubs.js
```

This will generate and write the stubs into src/data/fake-stubs/ and will log a message to say how many files were written, now you can run the app with those stubs:

```bash
npm run watch-fake-stub
```

#### Real stubs

If you want to be able to run the app without a db and backend running you can run a script:

```bash
node src/data/fetch-backend-stubs.js
```

That will fetch a response from all the APIs and write them to disk. To avoid losing active stubs, a folder called "backend" will be created with the current date and time appended, you will need to rename this to "backend" in src/data/stubs/ and then these are the responses that will then be returned if you enable stub mode:

```bash
npm run watch-stub
```

Now you can stop the db and backend from running and the app will still work.

## Testing

To test the Node code:

```bash
npm test
```

To test the client side code:

```bash
npm run test:client
```

# Releases

If you have a small branch with minimal commits then run the commands below on the branch. If you have a lot of commits over a long period of time then create a new release branch.

First check the current version:

```bash
npm version
```

Now decide what the next semver version will be and create the branch:

```bash
git checkout master
git checkout -b release-vx.x.x
```

The commands below will change the version in the package.json and the npm-shrinkwrap.json and then it will create a git tag and try to push the branch and the tag.

Choose the next correct semver version and run the appropriate command:

### Patch

Bug fixes and small changes.

```bash
npm version patch
```

### Minor

Backwards compatible changes and new features.

```bash
npm version minor
```

### Major

Breaking changes.

```bash
npm version major
```

### Errors

If you have not pushed the local branch then running the command above will output an error. Just copy and run the git push command (output in the error) and then run:

```bash
git push origin --tags
```

To push the tag up to origin.

Now you can create a PR in github, but you will have to wait for CircleCI to build and run the tests before you can merge. Once the merge is complete CircleCI will run the build and tests again.

# Deploy

## ITHC
Heroku will auto build and deploy from develop onto the ITHC env.

## Staging/Production

Heroku will auto build master on to the staging environment but you will need to use the "Promote to Production" button on the Heroku dashboard to deploy to Production.

# Docker

## Docker compose

Docker images are built automatically by docker hub for all branches and version tags.

To start all the services you can use docker compose:

```bash
docker-compose up
```

Which will require a database to be running and DATABASE_URL env var to be defined

You can start a database by running:

```
docker run -d -p 5432:5432 -e POSTGRES_DB=export-wins-data postgres:9
```

And use a script to generate some data, or to start a clean db, use compose with the over ride file:

```bash
docker-compose -f docker-compose.yml -f docker-compose.clean.yml up
```
