import { createSlice } from "@reduxjs/toolkit";

export interface Order {
    orderId: string;
    start: {
        latitude: number;
        longitude: number;
    };
    end: {
        latitude: number;
        longitude: number;
    };
    price: number;
}

interface InitialState {
    orders: Order[],
    deliveries: Order[]
}

const initialState: InitialState = {
    orders: [
        {
            orderId: 'ukKUKniYP',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 3000,
        },
        {
            orderId: '9ZLbPkiXj',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 3400,
        },
        {
            orderId: 'kq2Ymi3Xi',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        },
        {
            orderId: 'ieUhPYGt',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        },
        {
            orderId: '5',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        },
        {
            orderId: '6',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        },
        {
            orderId: '7',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        },
        {
            orderId: '8',
            start: {
                latitude: 127.3,
                longitude: 35,
            },
            end: {
                latitude: 127.4,
                longitude: 35.1,
            },
            price: 2800,
        }
    ],
    deliveries: []
};
const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action) {
            state.orders.push(action.payload);
        },
        acceptOrder(state, action) {
            const index = state.orders.findIndex(i => i.orderId === action.payload);
            if (index > -1) {
                state.deliveries.push(state.orders[index]);
                state.orders.splice(index, 1);
            }
        },
        rejectOrder(state, action) {
            const index = state.orders.findIndex(i => i.orderId === action.payload);
            if(index > - 1) {
                state.orders.splice(index, 1);
                state.deliveries.splice(index, 1);
            }
        }
    },
    extraReducers: builder => {}
});

export default orderSlice