import express from 'express';
import Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import HttpError from "./utils/HttpError";
import { errorHandler, handlerWrapper } from "./routers/utils";
import log from "loglevel";
import countriesRouter from './routers/countriesRouter';

const app = express();
const config = require('../config/config.js');

//Sentry.init({ dsn: config.sentry_dsn });

/*
 * Check request
 */
app.use(handlerWrapper(async (req, _res, next) => {
  if(req.method === "POST" || req.method === "PATCH"  || req.method === "PUT" ){
    if(req.headers['content-type'] !== "application/json"){
    throw new HttpError(415, "Invalid content type. API only supports application/json");
    }
  }
  next();
}));

app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

//routers
app.use('/countries', countriesRouter);
// Global error handler
app.use(errorHandler);

const version = require('../package.json').version
app.get('*',function (req, res) {
  res.status(404).send(version)
});

export default app;