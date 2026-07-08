import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/add', async ({ foodId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart/items', { foodId, quantity });
    toast.success('Added to cart');
    return data.cart;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Could not add item');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ foodId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/items/${foodId}`, { quantity });
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeCartItem = createAsyncThunk('cart/remove', async (foodId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/items/${foodId}`);
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart');
    return true;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { cart: { items: [] }, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = { items: [] };
      });
  },
});

export default cartSlice.reducer;
