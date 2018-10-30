const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;
const ngPort = process.env.NG_PORT || 4200;
const jwtSecret = 'phahng9tie6uthashe4Deng8Iek0eefahv9aawu1ah';
/**
 * set to 2 hours
 * (values without unit are by default ms,
 * see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
 */
const jwtExpiryTime = '2h';
const baseUrl = '/api/v1/';
const email = {
  service: 'gmail',
  address: 'iot.fablab@gmail.com',
  password: '80ef1M4MgoGX'
};
const publicRoutes = [
  {
    url: `${baseUrl}orders`,
    canChilds: true,
    methods: ['GET']
  },
  {
    url: `${baseUrl}orders/count`,
    methods: ['POST']
  },
  {
    url: `${baseUrl}orders/search`,
    methods: ['POST']
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
    url: `${baseUrl}fablabs`,
    canChilds: true,
    methods: ['*']
  }
];
const dev = {
  jwtSecret,
  jwtExpiryTime,
  ssl: {
    privateKeyPath: '',
    certificatePath: ''
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
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-dev'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `http://localhost:${port}${baseUrl}`,
  baseUrlFrontend: `http://localhost:${ngPort}`,
  cors: {
    whitelist: [`http://localhost:${ngPort}`],
    corsOptions: {
      origin: undefined,
      credentials: true
    }
  }
  // cors: undefined // if testing backend routes in dev mode without using the frontend
};

const prod = {
  jwtSecret,
  jwtExpiryTime,
  ssl: {
    privateKeyPath: '/etc/letsencrypt/live/iot-fablab.ddns.net/privkey.pem',
    certificatePath: '/etc/letsencrypt/live/iot-fablab.ddns.net/cert.pem'
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
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-staging'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `https://localhost:${port}${baseUrl}`,
  baseUrlFrontend: `https://iot-fablab.ddns.net`,
  // cors: {
  //   whitelist: [
  //     `https://localhost:${ngPort}`,
  //     `https://212.83.56.107:${ngPort}`,
  //     `https://iot-fablab.ddns.net:${ngPort}`,
  //     `http://localhost:${ngPort}`,
  //     `http://212.83.56.107:${ngPort}`,
  //     `http://iot-fablab.ddns.net:${ngPort}`
  //   ],
  //   corsOptions: {
  //     origin: undefined,
  //     credentials: true
  //   }
  // }
  cors: undefined
};

const test = {
  jwtSecret,
  jwtExpiryTime,
  ssl: {
    privateKeyPath: '',
    certificatePath: ''
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
      host: 'mongodb://mongo:27017/',
      database: 'iot-fablab'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `http://localhost:${port}${baseUrl}`,
  baseUrlFrontend: `http://localhost:${ngPort}`,
  cors: undefined
};

const testLocal = {
  jwtSecret,
  jwtExpiryTime,
  ssl: {
    privateKeyPath: '',
    certificatePath: ''
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
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-dev'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `http://localhost:${port}${baseUrl}`,
  baseUrlFrontend: `http://localhost:${ngPort}`,
  cors: undefined
};

export const configArr = { dev, prod, test, testLocal };

const config = configArr[env];

export default config;
