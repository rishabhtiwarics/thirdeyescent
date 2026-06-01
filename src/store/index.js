import { configureStore } from '@reduxjs/toolkit'
import productReducer from './productSlice'
import cartReducer from './cartSlice'
import checkoutReducer from './checkoutSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    auth: authReducer
  }
})
