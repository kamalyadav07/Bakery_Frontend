import React, { useReducer } from 'react';
import CartContext from './cartContext';
import cartReducer from './cartReducer';
import { ADD_TO_CART, REMOVE_FROM_CART, CLEAR_CART } from '../types';

// Create a custom hook for using the cart context
export const useCart = () => React.useContext(CartContext);

const CartState = (props) => {
    const initialState = {
        cartItems: [],
    };

    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Actions
    const addToCart = (item) => {
        dispatch({ type: ADD_TO_CART, payload: item });
    };

    const removeFromCart = (id) => {
        dispatch({ type: REMOVE_FROM_CART, payload: id });
    };

    const clearCart = () => {
        dispatch({ type: CLEAR_CART });
    };

    return (
        <CartContext.Provider
            value={{
                cartItems: state.cartItems,
                addToCart,
                removeFromCart,
                clearCart,
            }}
        >
            {props.children}
        </CartContext.Provider>
    );
};

export default CartState;