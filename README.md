# Fashion Cloud Test Task

## Overview

This projects implement the task. Please check `api.yml` for Swagger definition.

## Development Tooling

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com)

## Configuration

Check `.env.example` file, create `.env` or set environments variables.

## Running

- Start MongoDB via `docker-compose up` or add URI link to the environment
- `npm start`

## Testing Approach

- [standart](http://eslint.org) with [standard](https://standardjs.com) is used for checking code style and JS best practice..
- [dredd](https://dredd.readthedocs.io) is used for swagger and rest api testing.

## Development Approach

### Boundaries

In this part our application store any 3-rd party connection, state and etc. They have `start`/`stop` for bootstraping.

### Controls

In this part we store our business logic.

### Settings

We use `dotenv-safe` package for checking environment variables. If you miss part of the settings, then application will not start.

### Logger
We use `bunyan`

### Bootstraping and Gracefull shatdown
`app.js` is implemented for Bootstraping and Gracefull shatdown. Can be reused for tests.

## Additional features

MongoDB used for this features. 
- [TTL](https://docs.mongodb.com/manual/tutorial/expire-data/)
- [capped](https://docs.mongodb.com/manual/core/capped-collections/index.html)
- @TODO: move from db.js to migrations. How we will implement them?
