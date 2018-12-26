import * as envalid from 'envalid';

const ENV_VARS = {
  ROOT_DIR: envalid.str({
    desc: 'Absolute path to folder to serve logs from.'
  }),

  PORT: envalid.port({
    desc: 'Port to serve traffic from.',
    devDefault: 8080,
  }),

  PUBLIC_HOSTNAME: envalid.str({
    desc: 'Hostname that this app is served from (for auth redirection)',
    example: 'foo.bar.com',
    devDefault: 'localhost',
  }),

  SESSION_SECRET: envalid.str({
    desc: 'Key to use when encrypting session cookie. Changing this key will'
        + ' effectively revoke any existing sessions.',
    devDefault: 'Drunk and asleep in his boots'
  }),

  SSO_CLIENT_ID: envalid.str({
    desc: 'Client ID of registered EVE SSO app (developers.eveonline.com).',
    devDefault: '3a214b61040f4574b9fa350fbe8eef67',
  }),

  SSO_SECRET_KEY: envalid.str({
    desc: 'Secret key of registered EVE SSO app (developers.eveonline.com).',
    devDefault: '3XOYavDzS6C3OlnGvSHTe18zuv51oK61gxdg9sCG',
  }),

  // TODO: validate the structure of these
  AUTH_REQUIRED_CORPS: json<number[]>({
    desc: '[Login] Authenticated characters must be a member of one of these'
        + ' corps',
    devDefault: '[]',
    example: '[98477920, 98477920]',
  }),

  AUTH_REQUIRED_TITLES: json<string[]>({
    desc: '[Login] Authenticated characters must have at least one of these'
        + ' roles',
    default: '[]'
  }),

  AUTH_REQUIRED_ROLES: json<string[]>({
    desc: '[Login] Authenticated characters must have at least one of these'
        + ' roles',
    default: '[]',
  }),

  AUTH_WHITELISTED_CHARS: json<number[]>({
    desc: '[Login] These characters can log in regardless of other'
        + ' restrictions',
    default: '[]',
  }),
}

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

  const cleanedEnv = envalid.cleanEnv(process.env, ENV_VARS, options);

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

// Typed version of the envalid.json() validator
function json<T>(spec?: envalid.Spec<string>): envalid.ValidatorSpec<T> {
  return envalid.json(spec);
}
