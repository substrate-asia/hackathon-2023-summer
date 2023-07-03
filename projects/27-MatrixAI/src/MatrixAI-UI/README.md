# The frontend UI project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### Install

```
npm install
// or
yarn install
```

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!


## Docker guide

You can build docker image and then run it or run image by docker compose directly.

> To simplify the docker running environment, we use the sqlite database in docker.

#### a. Build docker image
* Docker Engine Version: 20.10+
* The latest `contractlab/matrixai-ui:latest` image has been pushed to docker hub

```bash
docker build -t contractlab/matrixai-ui .
```

#### b. Run demo by docker compose
* Docker Compose version v2.12+
* Change work directory to project directory, then use cmd like bellow:

```bash
docker compose -f docker/docker-compose.yml up -d
# or other version docker compose
docker-compose -f docker/docker-compose.yml up -d
```
