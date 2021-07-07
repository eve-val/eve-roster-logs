import { parseEnv } from "./env";
import { serve } from "./route/express";

// Uses Typescript source files for stack traces
import sourceMapSupport from "source-map-support";
sourceMapSupport.install();

// Crash the process in the face of an unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled promise rejection`);
  throw err;
});

// Go go go!
const env = parseEnv();
serve(env);
