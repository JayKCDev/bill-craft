import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/features/auth/authSlice";
import invoiceReducer from "@/app/features/invoice/invoiceSlice";
import { RESET_STATE } from "@/app/features/auth/authSlice";

const appReducer = combineReducers({
	authState: authReducer,
	invoiceState: invoiceReducer,
});

// Root reducer that handles the reset action
const rootReducer = (state: any, action: any) => {
	if (action.type === RESET_STATE) {
		state = undefined;
	}
	return appReducer(state, action);
};

export const store = configureStore({
	reducer: rootReducer,
	devTools: process.env.NODE_ENV === "development", // Enable DevTools only in development
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
