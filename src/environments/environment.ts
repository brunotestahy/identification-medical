// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { FrontEndConfig } from 'front-end-common';

export interface Environment extends FrontEndConfig {
  production: boolean;
  roomMapping: string;
  carePlanPath: string;
  carePlanAppPath: string;
  smartPath: string;
  smartAppPath: string;
  scheduleAppPath: string;
  schedulePath: string;
  patient?: {
    baseURL: string;
    searchURL?: string;
    paginationURL?: string;
    careProviderURL?: string;
    searchCachedURL?: string;
    paginationCachedURL?: string;
  };
}

const identificationServer = 'https://rdhcssmarthml01.rededor.corp/identification_server';

export const environment: Environment = {
  production: false,
  roomMapping: 'rdsl:model:map:room:buildingsector:copastar',

  // front-end-common configs
  his: 'source:copastar',
  homeRoute: '/app/patient',
  practitioner: {
    baseURL: `${identificationServer}/api/practitioner`,
    roleURL: '/role',
    searchURL: '/search',
    paginationURL: '/paginate'
  },
  patient: {
    baseURL: `${identificationServer}/api/patient`,
    searchURL: '/search',
    careProviderURL: '/practitioner',
    paginationURL: '/paginate',
    searchCachedURL: '/cached/search',
    paginationCachedURL: '/cached/paginate'
  },
  room: {
    baseURL: `${identificationServer}/api/room`,
    sectorURL: '/sector'
  },
  conceptmap: {
    baseURL: `${identificationServer}/api/conceptmap`
  },
  login: {
    authType: 'SMART',
    baseURL: `${identificationServer}`,
    ldapURL: '/users/login',
    smartURL: '/users/login/smart',
    meURL: '/api/users/me'
  },
  log: {
    baseURL: `${identificationServer}/api/log`,
    bulkRetry: 5,
    bulkSaveURL: '/bulksave',
    loggingInterval: 15000
  },
  appointment: {
    baseURL: `${identificationServer}/api/appointment`,
    shiftURL: '/shift'
  },
  rating: {
    baseURL: `${identificationServer}/api/rating`,
    searchURL: '/search',
    reasonURL: '/reason',
    paginationURL: '/paginate'
  },
  thumbnail: 'http://10.25.44.133:8459/thumbnail_server/thumbnail',
  carePlanPath: 'http://www.amazon.com',
  carePlanAppPath: 'careplan://',
  smartPath: 'http://www.google.com',
  smartAppPath: 'smarthosp://',
  scheduleAppPath: 'smartschedule://',
  schedulePath: 'http://localhost:4200'
};
