import { environment } from '../../environments/environment';
import { RUN_ENV } from './config.service';
let backendUrl = '';
let frontendUrl = '';
switch (environment.env) {
    case RUN_ENV.PROD:
        backendUrl = 'https://fablab.itm.uni-luebeck.de:3000/api/v1';
        frontendUrl = 'https://fablab.itm.uni-luebeck.de';
        break;
    case RUN_ENV.STAGING:
        backendUrl = 'https://iot-fablab.ddns.net:3000/api/v1';
        frontendUrl = 'https://iot-fablab.ddns.net';
        break;
    case RUN_ENV.DEV:
    default:
        backendUrl = 'http://localhost:3000/api/v1';
        frontendUrl = 'http://localhost:4200';
        break;
}



export const routes = {
    backendUrl: backendUrl,
    frontendUrl: frontendUrl,
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
            schedules: {
                root: 'schedules',
            },
            orders: {
                root: 'orders',
                getStatus: 'status',
                getOutstandingStatus: 'outstanding',
                getOrder: 'getOrder',
                comment: 'comment',
                count: 'count',
                search: 'search',
                files: 'files',
                shared: 'shared'
            },
            machines: {
                root: 'machines',
                byId: ':type/:id',
                getAll: '',
                machineTypes: 'types',
                materials: 'materials',
                laserTypes: 'laserTypes',
                count: 'count',
                countSuccessfulOrders: 'countSuccessfulOrders',
                search: 'search'
            },
            fablabs: {
                root: 'fablabs',
                getById: ':id'
            },
            octoprint: {
                root: 'octoprint',
                uploadFile: 'uploadFile',
                print: 'print'
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
                getOrder: 'getOrder',
                shared: {
                    root: 'shared',
                    create: 'create',
                    update: 'update',
                    delete: 'delete',
                    detail: 'detail'
                },
                outstandingOrders: 'outstanding',
                unfinishedOrders: 'unfinished',
                myOrders: 'myOrders'
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
                laserTypes: 'laserTypes',
                successfulOrders: 'countSuccessfulOrders'
            },
            fablabs: {
                root: 'fablabs',
                getById: ':id'
            }
        },
    }
};



