import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPricingRules as fetchPricingRulesApi,
  addPricingRule as addPricingRuleApi,
  updatePricingRule as updatePricingRuleApi,
  deletePricingRule as deletePricingRuleApi
} from '../../api/pricingRulesApi';


export const fetchPricingRules = createAsyncThunk(
  'pricingRules/fetchPricingRules',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchPricingRulesApi();
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const addPricingRule = createAsyncThunk(
  'pricingRules/addPricingRule',
  async (ruleData, { rejectWithValue }) => {
    try {
      return await addPricingRuleApi(ruleData);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const updatePricingRule = createAsyncThunk(
  'pricingRules/updatePricingRule',
  async ({ ruleId, ruleData }, { rejectWithValue }) => {
    try {
      return await updatePricingRuleApi(ruleId, ruleData);
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);

export const deletePricingRule = createAsyncThunk(
  'pricingRules/deletePricingRule',
  async (ruleId, { rejectWithValue }) => {
    try {
      await deletePricingRuleApi(ruleId);
      return ruleId; // Return the ID on success
    } catch (error) {
      return rejectWithValue(error.toString());
    }
  }
);


const pricingRulesSlice = createSlice({
  name: 'pricingRules',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPricingRules.pending, (state) => { state.loading = true; })
      .addCase(fetchPricingRules.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPricingRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPricingRule.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updatePricingRule.fulfilled, (state, action) => {
        const updatedRule = action.payload;
        const index = state.items.findIndex(rule => rule.rule_id === updatedRule.rule_id);
        if (index !== -1) {
          state.items[index] = updatedRule;
        }
      })
      .addCase(deletePricingRule.fulfilled, (state, action) => {
        state.items = state.items.filter(rule => rule.rule_id !== action.payload);
      });
  }
});

export default pricingRulesSlice.reducer;
