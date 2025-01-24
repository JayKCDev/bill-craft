// "use server";
import axios from "axios";
import { toast } from "sonner";
import { destroyCookie } from "nookies";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState } from "@/app/utils/constants";
import { setAuthCookies } from "@/app/utils/helpers";

// Constant for the reset action type
export const RESET_STATE = "RESET_STATE";

const fetchUserFromLocalStorage = () => {
	if (typeof window === "undefined") return null;
	const user = localStorage.getItem("user");
	return user ? JSON.parse(user) : null;
};

const defaultState: AuthState = {
	user: fetchUserFromLocalStorage() || {
		id: "",
		email: "",
		token: null,
		firstName: "",
		lastName: "",
		address: "",
		isSignup: false,
		tokenExpirationTime: null,
	},
	isLoading: false,
};

export const handleUserSubmit = createAsyncThunk(
	"handleUserSubmit",
	async (payload, thunkAPI) => {
		const apiCall = axios.post(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`,
			payload
		);

		await toast.promise(apiCall, {
			loading: "Loading...",
			success: "Almost there...",
			error: (err) => {
				const errorMessage = err.response.data.message;
				return errorMessage;
			},
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data.message);
		}
	}
);

export const handleUserOnboard = createAsyncThunk(
	"handleUserOnboard",
	async (payload, thunkAPI) => {
		// Access the Redux state to get the token
		const authState = thunkAPI.getState().authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const { email, ...finalPayload } = payload;

		const apiCall = axios.post(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/onboarding`,
			finalPayload,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Using Bearer token authentication
				},
			}
		);

		await toast.promise(apiCall, {
			loading: "Loading...",
			success: "Setting things up for you...",
			error: (err) => {
				const errorMessage = err.response.data.message;
				return errorMessage;
			},
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(err.response.data.message);
		}
	}
);

export const logout = createAsyncThunk("logout", async (_, thunkAPI) => {
	// First dispatch logout to clear auth state
	thunkAPI.dispatch(logoutReducer());

	// Clear user data and cookies
	localStorage.removeItem("user");
	destroyCookie(null, "token");
	destroyCookie(null, "isProfileComplete");

	// Dispatch the reset action to set default state of all slices
	thunkAPI.dispatch({ type: RESET_STATE });
});

const authSlice = createSlice({
	name: "auth",
	initialState: defaultState,
	reducers: {
		logoutReducer: (state) => {
			state.user = defaultState.user;
			state.isLoading = defaultState.isLoading;
		},
	},
	extraReducers: (builder) => {
		// handleUserSubmit
		builder.addCase(handleUserSubmit.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleUserSubmit.fulfilled, (state, action) => {
			const user = {
				...state.user,
				...action.payload,
				// To logout user after 1 hour
				tokenExpirationTime: new Date(
					new Date().getTime() + 1000 * 60 * 60
				).toISOString(),
			};

			state.user = { ...user };
			state.isLoading = false;
			localStorage.setItem("user", JSON.stringify(user));

			// Set token in cookies
			const isProfileComplete = Boolean(
				state.user.firstName && state.user.lastName && state.user.address
			);

			setAuthCookies(action.payload.token, isProfileComplete);
		});
		builder.addCase(handleUserSubmit.rejected, (state, action) => {
			state.isLoading = false;
		});

		// handleUserOnboard
		builder.addCase(handleUserOnboard.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleUserOnboard.fulfilled, (state, action) => {
			const user = { ...state.user, ...action.payload };
			state.user = { ...user };
			state.isLoading = false;

			let storedUser = JSON.parse(localStorage.getItem("user"));
			storedUser = { ...user };
			localStorage.setItem("user", JSON.stringify(storedUser));

			// Check if all required fields are non-empty strings
			const isProfileComplete = Boolean(
				state.user.firstName && state.user.lastName && state.user.address
			);
			setAuthCookies(null, isProfileComplete);
		});
		builder.addCase(handleUserOnboard.rejected, (state, action) => {
			state.isLoading = false;
		});

		// logout
		builder.addCase(logout.fulfilled, (state) => {
			state.isLoading = false;
			state.user = defaultState.user;
		});
	},
});

export const { logoutReducer } = authSlice.actions;
export default authSlice.reducer;
