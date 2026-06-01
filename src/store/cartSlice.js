import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [], // { id, name, price, quantity, size, image }
  totalQuantity: 0,
  totalPrice: 0,
}

const calculateTotals = (state) => {
  state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)
  state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size } = action.payload
      const existingItem = state.items.find(item => item.id === id && item.size === size)
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1
      } else {
        state.items.push(action.payload)
      }
      calculateTotals(state)
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload
      state.items = state.items.filter(item => !(item.id === id && item.size === size))
      calculateTotals(state)
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload
      const item = state.items.find(item => item.id === id && item.size === size)
      if (item && quantity > 0) {
        item.quantity = quantity
      }
      calculateTotals(state)
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalPrice = 0
    }
  }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
