// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
import { FrontEndConfig } from 'front-end-common';

export interface Environment extends FrontEndConfig {
  production: boolean;
  roomMapping: string;
}

const identificationServer = 'https://10.25.44.129:8459/identification';

export const environment: Environment = {
  production: false,
  roomMapping: 'rdsl:model:map:room:buildingsector',

  // front-end-common configs
  his: 'source:copastar',
  homeRoute: '/app/practitioner',
  practitioner: {
    baseURL: `${identificationServer}/api/practitioner`,
    roleURL: '/role',
    searchURL: '/search',
    paginationURL: '/paginate'
  },
  patient: {
    baseURL: `${identificationServer}/api/patient`,
    searchURL: '/search',
    paginationURL: '/paginate',
    careProviderURL: '/practitioner'
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
  thumbnail: 'http://10.25.44.132:8080/thumbnail_server/thumbnail'
};
