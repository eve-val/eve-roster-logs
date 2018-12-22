import * as envalid from 'envalid';

/**
 * Parses and validates environment variables (process.env).
 *
 * Crashes the process if the env vars fail validation.
 *
 * Returns a collection of parsed vars. Code should use this; it should never
 * read directly from process.env.
 */
export function parseEnv(env: NodeJS.Process['env']) {
  const options: envalid.StrictCleanOptions = {
    strict: true,
    dotEnvPath: '.env',
  };

  if (process.env.NODE_ENV == 'production') {
    options.dotEnvPath = null as any; // bug in typings; should allow null
  }

  const cleanedEnv = envalid.cleanEnv(process.env, {
    PORT: envalid.port(),
    ROOT_DIR: envalid.str(),
  }, options);

  if (cleanedEnv.isProd) {
    process.env.NODE_ENV = 'production';
  } else if (cleanedEnv.isDev) {
    process.env.NODE_ENV = 'development';
  } else if (cleanedEnv.isTest) {
    process.env.NODE_ENV = 'test';
  } else {
    throw new Error(`Unknown or unset NODE_ENV: "${process.env.NODE_ENV}".`);
  }

  return cleanedEnv;
}

export type Env = ReturnType<typeof parseEnv>;
