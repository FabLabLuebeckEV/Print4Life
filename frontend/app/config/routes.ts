import { environment } from '../../environments/environment';
import { RUN_ENV } from './config.service';
let backendUrl = '';
switch (environment.env) {
    case RUN_ENV.PROD:
        backendUrl = 'https://fablab.itm.uni-luebeck.de:3000/api/v1';
        break;
    case RUN_ENV.STAGING:
        backendUrl = 'https://iot-fablab.ddns.net:3000/api/v1';
        break;
    case RUN_ENV.DEV:
    default:
        backendUrl = 'http://localhost:3000/api/v1';
        break;
}



export const routes = {
    backendUrl: backendUrl,
    paths: {
        backend: {
            users: {
                root: 'users',
                getRoles: 'roles',
                getLanguages: 'languages',
                login: 'login',
                findown: 'findown',
                search: 'search',
                count: 'count',
                activationRequest: 'activationRequest',
                resetPassword: 'resetPassword',
                changePassword: 'changePassword',
                getNames: 'getNames'
            },
            orders: {
                root: 'orders',
                getStatus: 'status',
                getOrder: 'getOrder',
                comment: 'comment',
                count: 'count',
                search: 'search',
                upload: 'upload',
                download: 'download'
            },
            machines: {
                root: 'machines',
                byId: ':type/:id',
                getAll: '',
                machineTypes: 'types',
                materials: 'materials',
                laserTypes: 'laserTypes',
                count: 'count'
            },
            fablabs: {
                root: 'fablabs',
                getById: ':id'
            }
        },
        frontend: {
            users: {
                root: 'users',
                signup: 'signup',
                login: 'login',
                update: 'edit',
                list: 'list',
                profile: 'profile'
            },
            orders: {
                root: 'orders',
                create: 'create',
                update: 'update',
                delete: 'delete',
                detail: 'detail',
                getOrderById: 'getById',
                getAllOrders: '',
                getStatus: 'status',
                getOrder: 'getOrder'
            },
            machines: {
                root: 'machines',
                create: 'create',
                update: 'update',
                delete: 'delete',
                getById: ':type/:id',
                getAll: '',
                machineTypes: 'types',
                materials: 'materials',
                laserTypes: 'laserTypes'
            },
            fablabs: {
                root: 'fablabs',
                getById: ':id'
            }
        },
    }
};



