import { createSlice } from "@reduxjs/toolkit"

const initialState= {
    cart :[],
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addItem(state,action){
            state.cart.push(action.payload)

        },
        deleteItem(state,action){
            // payload = id of item
            state.cart = state.cart.filter(item=> item.pizzaId !== action.payload)
        },
        increaseQuantityOfItem(state,action){
            const item = state.cart.find(item => item.pizzaId === action.payload)
            item.quantity++;
            item.totalPrice = item.quantity * item.unitPrice;
        },
        decreaseQuantityOfItem(state,action){
             const item = state.cart.find(item => item.pizzaId === action.payload)
            item.quantity--
            item.totalPrice = item.quantity * item.unitPrice;
        },
        clearCart(state,action){
            state.cart = initialState.cart
        }
    }
});

export const {addItem,deleteItem,increaseQuantityOfItem,decreaseQuantityOfItem,clearCart} = cartSlice.actions

export default cartSlice.reducer ;

export const getCart = state => state.cart.cart;

export const getCurrentQuantityById = (id) => (state) => {
  const item = state.cart.cart.find((item) => item.pizzaId === id);
  return item ? item.quantity : 0;
};


export const getTotalCartItems = state=> state.cart.cart.reduce((sum,item) => sum + item.quantity,0)

export const getTotalCartPrice= state=> state.cart.cart.reduce((sum,item) => sum + item.totalPrice,0)