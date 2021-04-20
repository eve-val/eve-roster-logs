# Deploying to production

The app is designed to run in a Heroku-like environment (see `app.json`), but
it can also be run manually.

Before starting the app, the following commands must be run:

    # First, clone the git repo, then:
    $ npm install
    $ npm run build

The command to invoke the server is:

    $ npm start

The following environment variables must be set before starting the server:

- `NODE_ENV` - should be set to `production`
- `PORT` - should be set to whatever your setup requires. If you aren't doing
  any proxying, then this should be `80`.
- `ROOT_DIR` - Absolute path to the folder that contains the log files you want
  to serve.

There are various ways to set env variables; use what is most appropriate for
your setup. If you need a suggestion, `node-foreman` is a good place to start.
