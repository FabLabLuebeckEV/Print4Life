import { RUN_ENV } from 'frontend/app/config/config.service';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

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
  backendUrl: 'http://localhost:3000/api/v1',
  frontendUrl: 'http://localhost:4200',
  production: false,
  env: RUN_ENV.DEV
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
