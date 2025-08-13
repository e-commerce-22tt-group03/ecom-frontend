import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAddressesApi, createAddressApi, setDefaultAddressApi } from '../../api/addressApi';

export const fetchAddresses = createAsyncThunk('address/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await fetchAddressesApi();
  } catch (e) {
    return rejectWithValue(e.message || e.toString());
  }
});

export const createAddress = createAsyncThunk('address/create', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await createAddressApi(data);
    await dispatch(fetchAddresses());
    return res;
  } catch (e) {
    return rejectWithValue(e.message || e.toString());
  }
});

export const setDefaultAddress = createAsyncThunk('address/setDefault', async (addressId, { dispatch, rejectWithValue }) => {
  try {
    const res = await setDefaultAddressApi(addressId);
    await dispatch(fetchAddresses());
    return res;
  } catch (e) {
    return rejectWithValue(e.message || e.toString());
  }
});

const addressSlice = createSlice({
  name: 'address',
  initialState: {
    addresses: [],
    defaultAddressId: null,
    status: 'idle',
    creating: false,
    settingDefault: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.addresses = action.payload || [];
        const def = state.addresses.find(a => a.is_default);
        state.defaultAddressId = def ? def.address_id : null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload; })

      .addCase(createAddress.pending, (state) => { state.creating = true; state.error = null; })
      .addCase(createAddress.fulfilled, (state) => { state.creating = false; })
      .addCase(createAddress.rejected, (state, action) => { state.creating = false; state.error = action.payload; })

      .addCase(setDefaultAddress.pending, (state) => { state.settingDefault = true; state.error = null; })
      .addCase(setDefaultAddress.fulfilled, (state) => { state.settingDefault = false; })
      .addCase(setDefaultAddress.rejected, (state, action) => { state.settingDefault = false; state.error = action.payload; });
  }
});

export const selectAddresses = (state) => state.address.addresses;
export const selectDefaultAddress = (state) => state.address.addresses.find(a => a.is_default) || null;
export const selectDefaultAddressId = (state) => state.address.defaultAddressId;

export default addressSlice.reducer;
