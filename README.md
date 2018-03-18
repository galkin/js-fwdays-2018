# FWday workshop source-code

## The task

Your task is to build a REST API that exposes methods to interact with a cache that you will build. You will have to use Node.js and Express.js to build the API and MongoDB to store the cache data in. The cache does not have another data source in the background that is cached. All data returned by the cache is random dummy data. You do not need to build a frontend. The API shall be used with tools like curl or Postman.

Following features have to be implemented for the cache:

- Add an endpoint that returns the cached data for a given key. If the key is not found in the cache:
    1. Log an output “Cache miss”
    2. Create a random string
    3. Update the cache with this random string
    4. Return the random string
- If the key is found in the cache:
    1. Logan output “Cache hit”
    2. Get the data for this key
    3. Return the data
- Add an endpoint that returns all stored keys in the cache
- Add an endpoint that creates/updates the data for a given key
- Add an endpoint that removes a given key from the cache
- Add an endpoint that removes all keys from the cache

Following additional features have to be also included:
- The number of entries allowed in the cache is limited. If the maximum amount of cached items is reached, some old entry needs to be overwritten (Please explain the approach of what is overwritten in the comments of the source code)
- Every cached item has a Time To Live (TTL). If the TTL is exceeded, the cached data will not be used. A new random value will then be generated (just like cache miss). The TTL will be reset on every read/cache hit

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
