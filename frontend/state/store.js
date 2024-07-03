import { createAsyncThunk, createSlice, configureStore } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk('pizzaForm/fetchData', async () => {
  const response = await fetch('http://localhost:9009/api/pizza/history');
  return response.json();
});

export const postOrder = createAsyncThunk('pizza/postOrder', async (order, { rejectWithValue }) => {
  try {
    const response = await fetch('http://localhost:9009/api/pizza/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error('Failed to post order');
    return response.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState: {
    fullName: '',
    size: '',
    toppings: [],
    loading: false,
    data: [],
    error: '',
    postError: '',
    postSuccess: false,
  },
  reducers:{
    updateField: (state, action) => {
      const { name, value, type, checked } = action.payload;
      if (name === 'toppings') {
        if (checked) {
          state.toppings.push(value);
        } else {
          state.toppings = state.toppings.filter(topping => topping !== value);
        }
      } else {
        state[name] = value;
      }
    },
    submitForm: (state) => {
      state.loading = true;
      state.postError = '';
      state.postSuccess = false;
    },
    submitSuccess: (state) => {
      state.loading = false;
      state.postSuccess = true;
    },
    submitFailure: (state, action) => {
      state.loading = false;
      state.postError = action.payload;
    },
    resetForm: (state) => {
      state.fullName = '';
      state.size = '';
      state.toppings = [];
      state.postSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postOrder.pending, (state) => {
        state.loading = true;
        state.postError = '';
        state.postSuccess = false;
      })
      .addCase(postOrder.fulfilled, (state) => {
        state.loading = false;
        state.postSuccess = true;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.loading = false;
        state.postError = action.payload;
      });
  },
});
export const { updateField, submitFailure, submitForm, submitSuccess, resetForm } = pizzaSlice.actions;


export default pizzaSlice.reducer;


const exampleReducer = (state = { count: 0 }) => {
  return state;
};





export const resetStore = () => configureStore({
  reducer: {
    example: exampleReducer,
    getInformation: pizzaSlice.reducer,
    pizza: pizzaSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // add your middleware here if necessary
    ),
});

export const store = resetStore();
