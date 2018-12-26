import axios, { AxiosRequestConfig } from 'axios';


export async function fetchEsi<T = any>(request: EsiRequest): Promise<T> {
  const config: AxiosRequestConfig = {
    url: BASE_URL + request.url,
    method: request.method || 'get',
    params: request.query,
    headers: {
      // According to CCP, this Accept header is not necessary, but the cURL
      // example sets it, so ¯\_(ツ)_/¯
      'Accept': 'application/json',
      'User-Agent': 'SOUND Roster (roster.of-sound-mind.com)',
    },
  };

  if (request.token != undefined) {
    config.headers['Authorization'] = `Bearer ${request.token}`;
  }
  if (request.body != undefined) {
    config.headers['Content-Type'] = 'application/json';
    config.data = request.body;
  }

  return (await axios(config)).data;
}

interface EsiRequest {
  url: string,
  method?: 'get' | 'post',
  token?: string,
  body?: object,
  query?: object,
}

const BASE_URL = 'https://esi.evetech.net';
