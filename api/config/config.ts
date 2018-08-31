const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;
const ngPort = process.env.NG_PORT || 4200;
const jwtSecret = 'verInsecurePW!!!111einself';
const baseUrl = '/api/v1/';
const publicRoutes = [`${baseUrl}orders`];
const dev = {
  jwtSecret,
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
  connections: {
    mongo: {
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-staging'
    }
  },
  rawBaseUrl: baseUrl,
  publicRoutes,
  baseUrlBackend: `http://localhost:${port}${baseUrl}`,
  baseUrlFrontend: `http://localhost:${ngPort}`,
  cors: {
    whitelist: [`http://localhost:${ngPort}`, `http://212.83.56.107:${ngPort}`, `http://iot-fablab.ddns.net:${ngPort}`],
    corsOptions: {
      origin: undefined,
      credentials: true
    }
  }
};

const test = {
  jwtSecret,
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
