export const routes = {
    backendUrl: 'http://localhost:3000/api/v1',
    paths: {
        orders: {
            root: 'orders',
            createOrder: 'placeOrder',
            updateOrder: 'updateOrder',
            deleteOrder: 'deleteOrder',
            getOrderById: ':id',
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
    }
};



