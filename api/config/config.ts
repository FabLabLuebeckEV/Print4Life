const env = process.env.NODE_ENV;
const dev = {
  connections: {
    mongo: {
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-test'
    }
  }
};
const prod = {
  connections: {
    mongo: {
      host: 'mongodb://127.0.0.1:27017/',
      database: 'iot-fablab-staging'
    }
  }
};

const configArr = { dev, prod };

const config = configArr[env];

export default config;
