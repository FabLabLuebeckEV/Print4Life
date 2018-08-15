export const routes = {
    backendUrl: 'http://localhost:3000/api/v1',
    paths: {
        backend: {
            users: {
                root: 'users',
                getRoles: 'roles',
                create: 'signup'
            },
            orders: {
                root: 'orders',
                getStatus: 'status',
                // TODO: not implemented yet, should be a post
                //  request with an object passed as a selector for mongoose
                getOrder: 'getOrder',
                comment: 'comment',
                count: 'count',
                search: 'search'
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
                create: 'signup',
                signin: 'signin',
                update: 'edit'
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
                getOrder: 'getOrder' // TODO: not implemented yet, should be a post request with an object passed as a selector for mongoose
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



