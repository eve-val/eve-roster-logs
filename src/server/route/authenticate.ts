import express = require('express');
import * as querystring from 'querystring';
import axios from 'axios';
import { Env } from '../env';
import { fetchEsi } from '../esi/fetchEsi';

export async function AUTHENTICATE(
  req: express.Request,
  res: express.Response,
) {
  const env = res.context.env;
  const authCode = req.query['code'];

  const tokens = await fetchAccessTokens(env, authCode);
  const authInfo = await fetchAuthInfo(tokens.access_token);

  const [publicData, titles, roles] = await Promise.all([
    fetchEsi<CharacterPublicDataResponse>({
      url: `/v4/characters/${authInfo.CharacterID}/`,
    }),

    fetchEsi<CharacterTitlesResponse>({
      url: `/v1/characters/${authInfo.CharacterID}/titles/`,
      token: tokens.access_token,
    }),

    fetchEsi<CharacterRolesResponse>({
      url: `/v2/characters/${authInfo.CharacterID}/roles/`,
      token: tokens.access_token,
    }),
  ]);

  const authorized =
      isOnWhitelist(env, authInfo.CharacterID)
      || (passesCorpRequirement(env, publicData.corporation_id)
          && passesTitleRequirement(env, titles)
          && passesRoleRequirement(env, roles.roles));

  if (authorized) {
    req.session = {
      authenticated: Date.now(),
      character: authInfo.CharacterID,
      corporation: publicData.corporation_id,
    };
    res.redirect('/');
  } else {
    res.redirect('/login?message=not_authorized');
  }
}

async function fetchAccessTokens(env: Env, authCode: string) {
  const ssoCode =
      Buffer.from(`${env.SSO_CLIENT_ID}:${env.SSO_SECRET_KEY}`)
          .toString('base64');

  const response = await axios.post<AccessTokenResponse>(
    'https://login.eveonline.com/oauth/token',
    querystring.stringify({
      grant_type: 'authorization_code',
      code: authCode,
    }), {
      headers: {
        'Authorization': 'Basic ' + ssoCode,
      },
    });

  return response.data;
}

async function fetchAuthInfo(accessToken: string) {
  const response = await axios.get<AuthInfoResponse>(
      'https://login.eveonline.com/oauth/verify', {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
  });
  return response.data;
}

function isOnWhitelist(env: Env, characterId: number) {
  return env.AUTH_WHITELISTED_CHARS.includes(characterId);
}

function passesCorpRequirement(env: Env, corpId: number) {
  if (env.AUTH_REQUIRED_CORPS.length > 0) {
    return env.AUTH_REQUIRED_CORPS.includes(corpId);
  } else {
    return true;
  }
}

function passesTitleRequirement(env: Env, titles: CharacterTitlesResponse) {
  if (env.AUTH_REQUIRED_TITLES.length > 0) {
    for (let title of titles) {
      if (env.AUTH_REQUIRED_TITLES.includes(title.name)) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}

function passesRoleRequirement(env: Env, roles: string[]) {
  if (env.AUTH_REQUIRED_ROLES.length > 0) {
    for (let role of env.AUTH_REQUIRED_ROLES) {
      if (roles.includes(role)) {
        return true;
      }
    }
    return false;
  } else {
    return true;
  }
}

interface AccessTokenResponse {
  access_token: string,
  token_type: string,
  refresh_token: string,
  expires_in: number,
}

interface AuthInfoResponse {
  CharacterID: number,
  CharacterName: string,
  ExpiresOn: string,
  Scopes: string,
  TokenType: string,
  CharacterOwnerHash: string,
  IntellectualProperty: string,
}

interface CharacterPublicDataResponse {
  alliance_id?: number,
  ancestry_id?: number,
  birthday: string,
  bloodline_id: number,
  corporation_id: number,
  description?: number,
  faction_id?: number,
  gender: 'female' | 'male',
  name: string,
  race_id: number,
  security_status?: number,
}

type CharacterTitlesResponse = {
  name: string,
  title_id: number,
}[];

interface CharacterRolesResponse {
  roles: string[],
  roles_at_hq?: string[],
  roles_at_base?: string[],
  roles_at_other?: string[],
}
