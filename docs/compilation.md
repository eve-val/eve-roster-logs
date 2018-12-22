# Toolchain notes

There are a lot of moving pieces for such a simple thing. Such is the way of
technology.

* There are two codebases, the *server* and the *client*.
* Both codebases are written in Typescript.
* However, the two codebases are compiled with different flags. There are a
number of differences, but the most obvious one is that the server compilation
emits Node-style modules while the client compilation emits ES5-style modules.
* The different Typescript configs for server and client are
/src/server/tsconfig.json and /src/client/tsconfig.json, respectively.
* Compiling the server is straightforward; it's built by the normal Typescript
compiler (`tsc`).
* Compiling the client is...significantly more complicated. Compilation is
driven by webpack, controlled via `webpack.config.js`. The Typescript compiler
is invoked somewhere in there, but it's a few layers deep.

## Production compilation

Production compilation is relatively straighforward:

1. First, the server is compiled via `tsc -p src/client/tsconfig.json`. This
dumps the resulting files into `/built/server/`.
2. Second, the client is compiled via `webpack --config webpack.prod.js`. This
compiles all of the client code into `/built/client/bundle.js`. Note that,
unlike the server compilation, the client compiles into a single file.

When the server starts up, it serves `bundle.js` like any other static file.

## Development mode

Here's where things get a bit...trickier.

In order to speed up compilation of the server, we use a long-running process
to cache compilation artifacts. This is created by invoking
`npm run watch-server`, which should be invoked in its own shell and left
running. Whenever any server files change, the codebase is recompiled into
`/built/server/`. Note that the server process will need to be killed and
restarted to pick up the new code changes (`nf start`).

On the client side, things are a bit messier. Webpack runs as part of the
server process itself, constantly recompiling `bundle.js` in response to code
changes. In fact, `bundle.js` is never written to disk anywhere; webpack hooks
directly into Express to serve it out of memory. Webpack also pulls a lot of
other tricks to enable *hot module reloading*. This essentially injects special
JS into our client bundle that will download and apply code changes in real
time. This...mostly works, although a page refresh is sometimes required.
