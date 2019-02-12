const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;
const ngPort = process.env.NG_PORT ? Number.parseInt(process.env.NG_PORT, 10) : 4200;
const ibmWatson = {
  key: process.env.WATSON_API_KEY || 'a-mvgc70-kzvlngabpn',
  token: process.env.WATSON_API_PASSWORD || 'UAwuv+jRcFO*jMKUvB',
  orgId: process.env.WATSON_ORG_ID || 'mvgc70',
  userRoles: ['PD_STANDARD_APP']
};
const jwtSecret = env === 'dev' || env === 'test' || env === 'testLocal'
  ? 'phahng9tie6uthashe4Deng8Iek0eefahv9aawu1ah'
  : process.env.JWT_SECRET;

const baseUrl = '/api/v1/';
const baseUrlBackend = `${process.env.BASE_URL_BACKEND || 'http://localhost'}:${port}${baseUrl}`;
const baseUrlFrontend = ngPort === 80
  ? `${process.env.BASE_URL_FRONTEND || 'http://localhost'}`
  : `${process.env.BASE_URL_FRONTEND || 'http://localhost'}:${ngPort}`;
/**
 * set to 2 hours
 * (values without unit are by default ms,
 * see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
 */
const jwtExpiryTime = '2h';
const attachmentBucket = 'orderAttachments';

const tmpDir = process.env.TMP_DIR || './tmp';
const email = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  from: process.env.EMAIL_ADDRESS,
  auth: {
    user: process.env.EMAIL_USER || 'iot.fablab@gmail.com',
    pass: process.env.EMAIL_PASS || 'scdkhsxiumwwgiob'
  }
};

const publicRoutes = [
  {
    url: `${baseUrl}orders`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}orders/:id`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}orders/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}orders/status`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}orders/status/outstanding`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}orders/search`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}orders/shared/:id/upload`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}orders/shared/:id/comment`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}orders/shared/:id/download/:fileId/`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}users/login`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}users/:id/activationRequest`,
    methods: ['PUT']
  },
  {
    url: `${baseUrl}users/:id/getNames`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}users/`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}users/resetPassword/`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}users/roles`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}users/languages`,
    methods: ['GET']
  },
  {
    url: `${baseUrl}machines`,
    canChilds: true,
    methods: ['GET']
  },
  {
    url: `${baseUrl}machines/3d-printers/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/lasercutters/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/millingMachines/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/otherMachines/search`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/3d-printers/search`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/lasercutters/search`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/millingMachines/search`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}machines/otherMachines/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}fablabs`,
    canChilds: true,
    methods: ['*']
  }
];
const dev = {
  jwtSecret,
  jwtExpiryTime,
  attachmentBucket,
  ibmWatson,
  tmpDir,
  ssl: {
    privateKeyPath: process.env.SSL_PRIV_KEY || '',
    certificatePath: process.env.SSL_CERT || ''
  },
  loggerRotateOptions: {
    datePattern: 'DD-MM-YYYY',
    dirname: 'logs',
    maxSize: '5m',
    maxFiles: '10'
  },
  email,
  connections: {
    mongo: {
      host: process.env.MONGO_HOST || 'mongodb://127.0.0.1:27017/',
      database: process.env.MONGO_DBNAME || 'iot-fablab-dev'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend,
  baseUrlFrontend,
  // cors: {
  //   whitelist: [baseUrlFrontend]
  // }
  cors: undefined // if testing backend routes in dev mode without using the frontend
};

const staging = {
  jwtSecret,
  jwtExpiryTime,
  attachmentBucket,
  ibmWatson,
  tmpDir,
  ssl: {
    privateKeyPath: process.env.SSL_PRIV_KEY,
    certificatePath: process.env.SSL_CERT
  },
  loggerRotateOptions: {
    datePattern: 'DD-MM-YYYY',
    dirname: 'logs',
    maxSize: '10m',
    maxFiles: '30'
  },
  email,
  connections: {
    mongo: {
      host: process.env.MONGO_HOST,
      database: process.env.MONGO_DBNAME
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend,
  baseUrlFrontend,
  cors: {
    whitelist: [
      baseUrlFrontend
    ]
  }
  // cors: undefined
};

const prod = {
  jwtSecret,
  jwtExpiryTime,
  attachmentBucket,
  ibmWatson,
  tmpDir,
  ssl: {
    privateKeyPath: process.env.SSL_PRIV_KEY,
    certificatePath: process.env.SSL_CERT
  },
  loggerRotateOptions: {
    datePattern: 'DD-MM-YYYY',
    dirname: 'logs',
    maxSize: '10m',
    maxFiles: '30'
  },
  email,
  connections: {
    mongo: {
      host: process.env.MONGO_HOST,
      database: process.env.MONGO_DBNAME
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend,
  baseUrlFrontend,
  cors: {
    whitelist: [
      baseUrlFrontend
    ]
  }
  // cors: undefined
};

const test = {
  jwtSecret,
  jwtExpiryTime,
  attachmentBucket,
  ibmWatson,
  tmpDir,
  ssl: {
    privateKeyPath: process.env.PRIV_KEY || '',
    certificatePath: process.env.CERT || ''
  },
  loggerRotateOptions: {
    datePattern: 'DD-MM-YYYY',
    dirname: 'logs',
    maxSize: '5m',
    maxFiles: '5'
  },
  email,
  connections: {
    mongo: {
      host: process.env.MONGO_HOST || 'mongodb://mongo:27017/',
      database: process.env.MONGO_DBNAME || 'iot-fablab'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `${process.env.BASE_URL_BACKEND || 'http://localhost'}:${port}${baseUrl}`,
  baseUrlFrontend: `${process.env.BASE_URL_FRONTEND || 'http://localhost'}:${ngPort}`,
  cors: undefined
};

const testLocal = {
  jwtSecret,
  jwtExpiryTime,
  attachmentBucket,
  ibmWatson,
  tmpDir,
  ssl: {
    privateKeyPath: process.env.PRIV_KEY || '',
    certificatePath: process.env.CERT || ''
  },
  loggerRotateOptions: {
    datePattern: 'DD-MM-YYYY',
    dirname: 'logs',
    maxSize: '5m',
    maxFiles: '5'
  },
  email,
  connections: {
    mongo: {
      host: process.env.MONGO_HOST || 'mongodb://127.0.0.1:27017/',
      database: process.env.MONGO_DBNAME || 'iot-fablab-dev'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `${process.env.BASE_URL_BACKEND || 'http://localhost'}:${port}${baseUrl}`,
  baseUrlFrontend: `${process.env.BASE_URL_FRONTEND || 'http://localhost'}:${ngPort}`,
  cors: undefined
};

export const configArr = {
  dev, prod, test, testLocal, staging
};

const config = configArr[env];

export default config;
