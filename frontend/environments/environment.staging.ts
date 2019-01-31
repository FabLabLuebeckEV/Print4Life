import { RUN_ENV } from 'frontend/app/config/config.service';

export const environment = {
    mqttUri: 'mqtt(s)://mvgc70.messaging.internetofthings.ibmcloud.com:PORT',
    mqttPubTopic: 'iot-2/evt/EVENTNAME/fmt/DATAFORMAT',
    mqttSubTopic: 'iot-2/type/Sensor/id/DEVICENAME/evt/EVENTNAME/fmt/DATAFORMAT',
    mqttPorts: [1883, 8883],
    production: true,
    env: RUN_ENV.STAGING
};
