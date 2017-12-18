import { FrontEndConfig } from 'front-end-common';

export interface Environment extends FrontEndConfig {
  production: boolean;
  roomMapping: string;
  carePlanPath: string;
  carePlanAppPath: string;
  smartPath: string;
  smartAppPath: string;
  scheduleAppPath: string;
  patient?: {
    baseURL: string;
    searchURL?: string;
    paginationURL?: string;
    careProviderURL?: string;
    searchCachedURL?: string;
    paginationCachedURL?: string;
  };
}

const identificationServer = 'https://hcssmart01.rededor.corp/identification_server';

export const environment: Environment = {
  production: true,
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
  thumbnail: 'https://hcssmart01.rededor.corp/thumbnail_server/thumbnail',
  carePlanPath: 'https://hcssmart01.rededor.corp/careplan',
  carePlanAppPath: 'careplan://',
  smartPath: 'https://hcssmart01.rededor.corp/smart/public/index.html',
  smartAppPath: 'smarthosp://',
  scheduleAppPath: 'smartschedule://'
};
