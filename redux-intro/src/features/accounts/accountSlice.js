import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    deposit(state, action) {
      state.balance += action.payload;
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      prepare(amount, purpose) {
        return {
          payload: { amount, purpose },
        };
      },

      reducer(state, action) {
        if (state.loan > 0) return;

        state.loan = action.payload.amount;
        state.loanPurpose = action.payload.purpose;
        state.balance = state.balance + action.payload.amount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

// ——— Thunk action creator for deposit with optional currency conversion ———
export function deposit(amount, currency) {
  // If already in USD, just return a plain action:
  //  -> this is the only dispatch, and redux will forward it straight to your deposit reducer
  if (currency === "USD") {
    return {
      type: "account/deposit",
      payload: amount, // action.payload === the USD amount
    };
  }

  // Otherwise, return a “thunk” function. redux-thunk middleware sees this,
  // intercepts it, and calls it with (dispatch, getState) instead of sending to reducers.
  return async function (dispatch, getState) {
    // —— First dispatch ——
    // Tell the slice we’re converting (so we can show a “loading” state)
    dispatch({ type: "account/convertingCurrency" });

    // Do the API call to convert the money to USD
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;

    // —— Second dispatch ——
    // Now we have the converted USD amount, dispatch the real deposit action:
    dispatch({ type: "account/deposit", payload: converted });
  };
}

export default accountSlice.reducer;
