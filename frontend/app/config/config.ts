export let config = {
    backendUrl: 'http://localhost:3000/api/v1',
    paths: {
        orders: {
            root: 'orders',
            createOrder: 'placeOrder',
            updateOrder: 'updateOrder',
            deleteOrder: 'deleteOrder',
            getOrderById: 'getOrderById',
            getAllOrders: ''
        },
        machines: {
            root: 'machines',
            create: 'create',
            update: 'update',
            delete: 'delete',
            getById: ':id',
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
    spinnerConfig: {
        bdColor: 'rgba(51, 51, 51, 0.8)',
        size: 'large',
        color: '#fff',
        type: 'ball-climbing-dot'
    }
};
