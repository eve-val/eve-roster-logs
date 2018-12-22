# Env Variables

Deployment-specific configuration is controlled by environment variables. For
example, the port from which to server traffic may vary depending on whether
we're deployed in production behind a proxy (typically port 5000) or doing
development locally (typically port 8080).

In a production environment, the process's env vars are set by the production
infrastructure (e.g. dokku, heroku, etc). During development, they're set by
Node Foreman (`nf`).

`nf start` spawns a new process, sets the desired env vars, and then
executes `npm start` (see `scripts.start` in `package.json`).

Development environment variables must be defined in a `.env` file.
