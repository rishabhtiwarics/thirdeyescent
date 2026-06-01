import { createSlice } from '@reduxjs/toolkit'
import { products as initialProducts } from '../data/products'

const initialState = {
  items: initialProducts,
  loading: false,
  error: null
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload
    }
  }
})

export const { setProducts } = productSlice.actions
export default productSlice.reducer
