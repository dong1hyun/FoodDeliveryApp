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
    orders: [],
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