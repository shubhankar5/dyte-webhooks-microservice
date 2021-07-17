[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# dyte-webhooks-microservice
A webhooks microservice API using Molecular and Node.js containing CRUD operations for working with URLs and a Trigger operation to send POST requests to the URLs from the databases in batches.

This is a [Moleculer](https://moleculer.services/)-based microservices project. Generated with the [Moleculer CLI](https://moleculer.services/docs/0.14/moleculer-cli.html).

## Tools used
* **Molecular** To create a microservice
* **Node.js** To create a gateway API for the microservices
* **MongoDB** Database to store the URLs
* **NATS server** Message broker for running the microservices

## How to use
Start the project with `npm run dev` command. 
After starting, open the http://localhost:3000/ URL in your browser. 
On the welcome page you can test the webhooks services via API Gateway and check the nodes & services.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call webhooks.list` - Call the `webhooks.list` action. This displays all the webhooks in the database
- `call webhooks.register --targetUrl www.mywebsite.com` - Call the `webhooks.register` action with the `targetUrl` parameter.
- ...And so on


## Services
- **api**: API Gateway services
- **webhooks**: Webhooks microservice. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Mixins
- **db.mixin**: Database access mixin for services. Based on [moleculer-db](https://github.com/moleculerjs/moleculer-db#readme)


## Useful links
* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/
* NATS Documentation: https://docs.nats.io/
* Docker Documentation: https://docs.docker.com/

## NPM scripts

- `npm run dev`: Start development mode (load all services locally with hot-reload & REPL)
- `npm run start`: Start production mode (set `SERVICES` env variable to load certain services)
- `npm run cli`: Start a CLI and connect to production. Don't forget to set production namespace with `--ns` argument in script
- `npm run ci`: Run continuous test mode with watching
- `npm test`: Run tests & generate coverage report
- `npm run dc:up`: Start the stack with Docker Compose
- `npm run dc:down`: Stop the stack with Docker Compose
