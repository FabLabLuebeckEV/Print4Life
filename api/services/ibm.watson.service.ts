import * as request from 'request';
import config from '../config/config';

const baseUrl = `https://${config.ibmWatson.orgId}.internetofthings.ibmcloud.com/api/v0002/`;

export class IBMWatsonService {
  /* eslint-disable class-methods-use-this */
  async createDevice (deviceType: string, deviceId: string, deviceInfo: object,
    credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.post(`${baseUrl}device/types/${deviceType}/devices`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      body: {
        deviceId, deviceInfo
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async getDevice (id: string, deviceType: string, credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.get(`${baseUrl}device/types/${deviceType}/devices/${id}`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async getAllDevices (deviceType: string, credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.get(`${baseUrl}device/types/${deviceType}/devices/`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async deleteDevice (id: string, deviceType: string, credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.delete(`${baseUrl}device/types/${deviceType}/devices/${id}`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async getDeviceTypes (credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.get(`${baseUrl}device/types`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async createAPIKey (credentials: { key: string, token: string }, username: string): Promise<any> {
    return new Promise((resolve, reject) => request.post(`${baseUrl}authorization/apikeys`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      body: {
        comment: `For User ${username}`,
        roles: config.ibmWatson.userRoles
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }

  async deleteAPIKey (id: string, credentials: { key: string, token: string }): Promise<any> {
    return new Promise((resolve, reject) => request.delete(`${baseUrl}authorization/apikeys/${id}`, {
      auth: {
        user: credentials.key,
        pass: credentials.token,
        sendImmediately: true
      },
      json: true
    }, (error, resp, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    }));
  }
  /* eslint-enable class-methods-use-this */
}

export default IBMWatsonService;
