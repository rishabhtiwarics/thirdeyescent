import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shippingDetails: null,
  paymentStatus: 'idle', // idle, processing, success, failed
  orderId: null,
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setShippingDetails: (state, action) => {
      state.shippingDetails = action.payload
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload
    },
    resetCheckout: (state) => {
      state.shippingDetails = null
      state.paymentStatus = 'idle'
      state.orderId = null
    }
  }
})

export const { setShippingDetails, setPaymentStatus, setOrderId, resetCheckout } = checkoutSlice.actions
export default checkoutSlice.reducer
