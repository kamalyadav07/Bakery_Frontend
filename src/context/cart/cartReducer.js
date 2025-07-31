import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from '../types';

const cartReducer = (state, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            // Check if the item is already in the cart
            const existingItem = state.cartItems.find(item => item._id === action.payload._id);

            if (existingItem) {
                // If it exists, update the quantity
                return {
                    ...state,
                    cartItems: state.cartItems.map(item =>
                        item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item
                    ),
                };
            } else {
                // If it's a new item, add it to the cart with quantity 1
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
                };
            }

        case REMOVE_FROM_CART:
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item._id !== action.payload),
            };

        case CLEAR_CART:
            return {
                ...state,
                cartItems: [],
            };

        default:
            return state;
    }
};

export default cartReducer;