import { RUN_ENV } from 'frontend/app/config/config.service';

export const environment = {
  mqtt: {
    uri: 'mqtt(s)://o7bxcz.messaging.internetofthings.ibmcloud.com:PORT',
    pubTopic: 'iot-2/evt/TOPICNAME/fmt/DATAFORMAT',
    subTopic: 'iot-2/type/Sensor/id/DEVICENAME/evt/TOPICNAME/fmt/DATAFORMAT',
    ports: [1883, 8883]
  },
  upload: {
    maxSize: 1024 * 1024 * 20 // 20 MiB
  },
  backendUrl: 'https://print4life.fablab-luebeck.de:3000/api/v1',
  frontendUrl: 'https://print4life.fablab-luebeck.de',
  production: true,
  env: RUN_ENV.PROD
};
