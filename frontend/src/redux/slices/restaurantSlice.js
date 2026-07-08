import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchRestaurants = createAsyncThunk('restaurants/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/restaurants', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchRestaurantById = createAsyncThunk('restaurants/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/restaurants/${id}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: [],
    total: 0,
    isLoading: false,
    current: null,
    currentMenu: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurants.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload.restaurants;
        state.total = action.payload.total;
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchRestaurantById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.current = action.payload.restaurant;
        state.currentMenu = action.payload.menu;
      });
  },
});

export default restaurantSlice.reducer;
