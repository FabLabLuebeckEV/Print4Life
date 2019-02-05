import { RUN_ENV } from 'frontend/app/config/config.service';

export const environment = {
    mqtt: {
        uri: 'mqtt(s)://mvgc70.messaging.internetofthings.ibmcloud.com:PORT',
        pubTopic: 'iot-2/evt/TOPICNAME/fmt/DATAFORMAT',
        subTopic: 'iot-2/type/Sensor/id/DEVICENAME/evt/TOPICNAME/fmt/DATAFORMAT',
        ports: [1883, 8883]
    },
    backendUrl: 'https://iot-fablab.ddns.net:3000/api/v1',
    frontendUrl: 'https://iot-fablab.ddns.net',
    production: true,
    env: RUN_ENV.STAGING
};
