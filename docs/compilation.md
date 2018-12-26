# Toolchain notes

There are a lot of moving pieces for such a simple thing. Such is the way of
technology.

* There are two codebases, the *server* and the *client*.
* Both codebases are written in Typescript, but are compiled separately.
* The server codebase must be compiled ahead of time (via
`npm run build`). When the server starts up, it compiles the client.
* Each compilation run with different flags. There are a number of differences, but the most obvious one is that the server compilation emits Node-style modules
while the client compilation emits ES5-style modules.
* The different Typescript configs for server and client are
/src/server/tsconfig.json and /src/client/tsconfig.json, respectively.
