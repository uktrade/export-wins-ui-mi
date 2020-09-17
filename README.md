Export Wins MI
==============

A front end project to show some MI data for Data Hub

[![Build Status](https://circleci.com/gh/uktrade/export-wins-ui-mi.svg?style=shield)](https://circleci.com/gh/uktrade/export-wins-ui-mi)

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

### Locally

#### Production

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

#### Development

To run in development mode (watching files for changes):

```bash
npm run watch
```

##### Fake stubs

To run in development mode and also use fake stubs, first you need to generate the stubs:

```bash
node src/data/create-backend-fake-stubs.js
```

This will generate and write the stubs into src/data/fake-stubs/ and will log a message to say how many files were written, now you can run the app with those stubs:

```bash
npm run watch-fake-stub
```

##### Real stubs

If you want to be able to run the app without a db and backend running you can run a script:

```bash
node src/data/fetch-backend-stubs.js
```

That will fetch a response from all the APIs and write them to disk. To avoid losing active stubs, a folder called "backend" will be created with the current date and time appended, you will need to rename this to "backend" in src/data/stubs/ and then these are the responses that will then be returned if you enable stub mode:

```bash
npm run watch-stub
```

Now you can stop the db and backend from running and the app will still work.

### Docker

The [image for this project](https://hub.docker.com/r/ukti/export-wins-ui-mi/tags/) is created automatically in Docker Hub, to run it you need to have some env variables created, as specified in the [env emplate](.env.template) and then use the following command:

#### Linux:

To start the app:

```bash
	docker run --name datahub-mi -d -p 8080:8080 -e "MI_SECRET=${MI_SECRET}" -e "JWT_SECRET=${JWT_SECRET}" -e "COOKIE_SECRET=${COOKIE_SECRET}" -e "USER_COOKIE_MAX_AGE=${USER_COOKIE_MAX_AGE}" -e "CACHE_VIEWS=${CACHE_VIEWS}" -e "LOG_LEVEL=${LOG_LEVEL}" -e "SERVER_WORKERS=${SERVER_WORKERS}" -e "URL_USING_MI=${URL_USING_MI}" -e "URL_KIM_PRINCIPLES=${URL_KIM_PRINCIPLES}" -e "MI_PROTOCOL=${MI_PROTOCOL}" ukti/export-wins-ui-mi:latest
```

#### OSX

If you want to run this app and a backend in docker, there is a little trick that needs to done. As the network integration for OSX is not as nice as Linux, you will need to create an alias to enable the app container to talk to the backend container.

Run this in terminal:

```bash
'[[ `ifconfig -r lo0 | grep 10.200.10.1 | wc -l` -eq 0 ]] && sudo ifconfig lo0 alias 10.200.10.1/24'
```

It will check whether the alias exists and if not it will prompt for the sudo password and create it.

Now start the app:

```bash
	docker run --name datahub-mi -d -p 8080:8080 -e "MI_SECRET=${MI_SECRET}" -e "JWT_SECRET=${JWT_SECRET}" -e "COOKIE_SECRET=${COOKIE_SECRET}" -e "USER_COOKIE_MAX_AGE=${USER_COOKIE_MAX_AGE}" -e "CACHE_VIEWS=${CACHE_VIEWS}" -e "LOG_LEVEL=${LOG_LEVEL}" -e "SERVER_WORKERS=${SERVER_WORKERS}" -e "URL_USING_MI=${URL_USING_MI}" -e "URL_KIM_PRINCIPLES=${URL_KIM_PRINCIPLES}" -e "MI_PROTOCOL=${MI_PROTOCOL}" -e "MI_HOST=10.200.10.1" ukti/export-wins-ui-mi:latest
```

Now visit your localhost on port 8080 and it should be running.

#### Stopping

To stop the container run:

```bash
	docker stop datahub-mi
```

And if you want to easily restart it, you need to delete the container

```bash
	docker rm datahub-mi
```

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

Once the branch has been merged to master, pull the latest master branch and then tag the release:

```bash
npm run tag-master
```

This will take the version number and tag it in git i.e. v1.2.3-master and then push the tags

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

The staging and production environments both require manual deployments. To to this, go to the Jenkins project `datahub-mi` and click on `Build with parameters`. Select `staging` from the dropdown list and enter the git tag you have created into the `Git_Commit` field. Once you have done this, press the `Build` button.

Once your changes have deployed successfully to staging, you can deploy to production by following the same process, but selecting `prod` in the dropdown.

# Docker compose

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


