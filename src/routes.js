import { Router } from 'express';

import ExampleController from './app/controllers/ExampleController';

import logRequestsMiddleware from './app/middlewares/logRequests';

const routes = new Router();

routes.use(logRequestsMiddleware);

routes.get('/example', ExampleController.index);

export default routes;
