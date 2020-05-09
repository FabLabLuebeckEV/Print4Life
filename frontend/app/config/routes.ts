import { environment } from '../../environments/environment';
const backendUrl = environment.backendUrl;
const frontendUrl = environment.frontendUrl;

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
                getNames: 'getNames',
                activate: 'activate'
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
            iotDevices: {
                root: 'iot-devices',
                create: '',
                getAll: '',
                search: 'search',
                deviceTypes: 'types',
                count: 'count'
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
            hospitals: {
                root: 'hospitals',
                getById: ':id'
            },
            octoprint: {
                root: 'octoprint',
                uploadFile: 'uploadFile',
                print: 'print'
            },
            service: {
                root: 'service',
                contact: 'contact'
            },
            blueprints: {
                root: 'blueprints'
            }
        },
        frontend: {
            aboutus: {
                root: 'about-us'
            },
            blueprints: {
                root: 'blueprints',
                list: 'list'
            },
            faq: {
                root: 'faq',
                contact: 'kontakt'
            },
            privacy: {
                root: 'privacy'
            },
            legal_notice: {
                root: 'legal-notice',
            },
            users: {
                root: 'users',
                signup: 'signup',
                thankyou: 'thankyou',
                login: 'login',
                update: 'edit',
                list: 'list',
                profile: 'profile',
                activate: 'activate'
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
                accept: 'accept',
                shipping: 'shipping',
                shared: {
                    root: 'shared',
                    create: 'create',
                    update: 'update',
                    delete: 'delete',
                    detail: 'detail'
                },
                outstandingOrders: 'outstanding',
                unfinishedOrders: 'unfinished',
                myOrders: 'myOrders',
                acceptedOrders: 'acceptedOrders'
            },
            iotDevices: {
                root: 'iotDevices',
                create: 'create',
                getAllIotDevices: '',
                detail: 'detail'
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
                getById: ':id',
                update: 'edit',
                profile: 'profile',
                register: 'register'
            }
        },
    }
};



