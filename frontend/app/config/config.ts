export let config = {
    backendUrl: 'http://localhost:3000/api/v1',
    paths: {
        orders: {
            root: 'orders',
            createOrder: 'placeOrder',
            updateOrder: 'updateOrder',
            deleteOrder: 'deleteOrder',
            getOrderById: 'getOrderById',
            getAllOrders: '',
            getStatus: 'status',
            getOrder: 'getOrder' // TODO: not implemented yet
        },
    }
};
