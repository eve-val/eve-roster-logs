import { parseEnv } from "./env";
import { serve } from "./route/express";

// Uses Typescript source files for stack traces
require("source-map-support").install();

// Crash the process in the face of an unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled promise rejection`);
  throw err;
});

// Go go go!
const env = parseEnv(process.env);
serve(env);
