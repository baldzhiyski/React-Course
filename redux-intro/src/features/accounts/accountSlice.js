const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        balance: state.balance + action.payload,
        isLoading: false,
      };
    case "account/withdraw":
      return {
        ...state,
        balance: state.balance - action.payload,
      };

    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        balance: state.balance + action.payload.amount,
        loanPurpose: action.payload.purpose,
      };

    case "account/payLoan":
      return {
        ...state,
        balance: state.balance - state.loan,
        loan: 0,
        loanPurpose: "",
      };

    case "account/convertingCurrency":
      return {
        ...state,
        isLoading: true,
      };

    default:
      return state;
  }
}

// features/accounts/accountActions.js

// 1️⃣ This is our action creator.
//    Depending on the currency it either returns a plain action
//    (synchronous path) or a thunk function (asynchronous path).
export function deposit(amount, currency) {
  // ——— Sync path ———
  if (currency === "USD") {
    // When currency is already USD, we just return a plain object.
    // The component’s dispatch(deposit(...)) will be the *only* dispatch,
    // and that action goes straight to the reducers.
    return {
      type: "account/deposit",
      payload: amount,
    };
  }

  // ——— Async (thunk) path ———
  // By returning a function, we hand control to redux-thunk middleware
  // instead of going straight to the reducers.
  return async function (dispatch, getState) {
    dispatch({ type: "account/convertingCurrency" });

    // ⚙️ First “dispatch”: this is actually the component’s call
    //    dispatch(deposit(amount, currency))—redux-thunk intercepts
    //    it because the “action” is a function.
    //
    //    thunk middleware sees “action” is a function and does:
    //      action(dispatch, getState)
    //
    //    So you end up inside this function.

    // 2️⃣ Do your external API call to convert to USD
    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    );
    const data = await res.json();
    const converted = data.rates.USD;

    // 3️⃣ Second dispatch: now that we've got the converted amount,
    //    we dispatch a *plain action object* to actually update state.
    //    This is the one that hits your reducers.
    dispatch({
      type: "account/deposit",
      payload: converted,
    });
  };
}
export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: {
      amount: amount,
      purpose: purpose,
    },
  };
}
export function withdraw(amount) {
  return {
    type: "account/withdraw",
    payload: amount,
  };
}
export function payLoan() {
  return {
    type: "account/payLoan",
  };
}
