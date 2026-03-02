import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
    totalPrice: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.items.find((x) => x.product === item.product);

            if (existingItem) {
                state.items = state.items.map((x) =>
                    x.product === existingItem.product ? item : x
                );
            } else {
                state.items.push(item);
            }

            state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter((x) => x.product !== action.payload);
            state.totalPrice = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.totalPrice = 0;
            localStorage.removeItem('cartItems');
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
