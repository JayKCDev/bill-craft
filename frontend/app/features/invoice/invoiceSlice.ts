import axios from "axios";
import { toast } from "sonner";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { generateInvoicePDF } from "@/app/utils/generateInvoicePDF";
import { Invoice, InvoiceState } from "@/app/utils/constants";
import { RESET_STATE } from "@/app/features/auth/authSlice";

const defaultState: InvoiceState = {
	invoices: [],
	invoiceToView: null,
	isLoading: false,
	initialFetchAttempted: false,
};

export const handleFetchInvoices = createAsyncThunk(
	"handleFetchInvoices",
	async (payload, thunkAPI) => {
		// Get the token from Redux state
		const authState = (thunkAPI.getState() as any).authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const apiCall = axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`, // Attach the token here
				},
			}
		);

		await toast.promise(apiCall, {
			loading: "Fetching invoices...",
			success: "Invoices fetched successfully",
			error: (err) => err.response.data.message,
		});

		try {
			const response = await apiCall;
			return response.data?.response;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.message);
		}
	}
);

export const fetchInvoiceById = createAsyncThunk(
	"fetchInvoiceById",
	async (invoiceId, thunkAPI) => {
		const apiCall = axios.get(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/view/invoice/${invoiceId}`
		);

		await toast.promise(apiCall, {
			loading: "Fetching invoice...",
			success: "Invoice fetched successfully",
			error: (err) => err.response.data.message,
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data.message);
		}
	}
);

export const handleCreateInvoice = createAsyncThunk(
	"handleCreateInvoice",
	async (payload, thunkAPI) => {
		const authState = (thunkAPI.getState() as any).authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const apiCall = axios.post(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/create`,
			payload,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		await toast.promise(apiCall, {
			loading: "Creating invoice...",
			success: (response) => response?.data?.message,
			error: (err) => err.response.data.message,
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (error) {
			toast.error("Error creating invoice");
			return thunkAPI.rejectWithValue(error?.response?.data?.message);
		}
	}
);

export const handleEditInvoice = createAsyncThunk(
	"handleEditInvoice",
	async (payload: { invoiceId: string; form: Invoice }, thunkAPI) => {
		const authState = (thunkAPI.getState() as any).authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const apiCall = axios.put(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/edit/${payload.invoiceId}`,
			payload.form,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		toast.promise(apiCall, {
			loading: "Editing invoice...",
			success: (response) => response?.data?.message,
			error: (err) => err.response.data.message,
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (error) {
			toast.error("Error updating invoice");
			return thunkAPI.rejectWithValue(error?.response?.data?.message);
		}
	}
);

export const handleDeleteInvoice = createAsyncThunk(
	"handleDeleteInvoice",
	async (invoiceId, thunkAPI) => {
		const authState = (thunkAPI.getState() as any).authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const apiCall = axios.delete(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/delete/${invoiceId}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		toast.promise(apiCall, {
			loading: "Deleting invoice...",
			success: "Invoice deleted successfully",
			error: (err) => err.response.data.message,
		});

		try {
			await apiCall;
			return { invoiceId };
		} catch (error) {
			return thunkAPI.rejectWithValue(error?.response?.data?.message);
		}
	}
);

export const handleInvoiceMarkAsPaid = createAsyncThunk(
	"handleInvoiceMarkAsPaid",
	async (invoiceId, thunkAPI) => {
		const authState = (thunkAPI.getState() as any).authState;
		const token = authState?.user?.token;

		if (!token) return toast.error("Request Token not found");

		const apiCall = axios.put(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/invoices/markPaid/${invoiceId}`,
			{},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		toast.promise(apiCall, {
			loading: "Marking invoice as paid...",
			success: "Invoice marked as paid",
			error: (err) => err.response.data.message,
		});

		try {
			const response = await apiCall;
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(err?.response?.data?.message);
		}
	}
);

/**
 * Reasons to define these functions outside of slice reducer:
 * state management logic stays in the slice
 * side effects remain in thunks
 */
export const handleInvoiceDownload = createAsyncThunk(
	"handleInvoiceDownload",
	async (invoiceId: string, thunkAPI) => {
		const invoiceState: any = thunkAPI.getState().invoiceState;

		const invoice = invoiceState.invoices.find(
			(invoice: Invoice) => invoice.id === invoiceId
		);

		if (!invoice) {
			toast.error("Invoice not found");
			return;
		}

		try {
			// Generate PDF
			const pdfBuffer = generateInvoicePDF(invoice);

			// Create blob and download
			const blob = new Blob([pdfBuffer], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute(
				"download",
				`bill-craft-invoice-${invoice.invoiceName}.pdf`
			);
			document.body.appendChild(link);
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url);

			toast.success("Invoice downloaded successfully");
		} catch (error) {
			toast.error("Error downloading invoice");
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const handleCopyLink = createAsyncThunk(
	"handleCopyLink",
	async (invoiceId: string, thunkAPI) => {
		if (!invoiceId) return toast.error("Invoice ID not found");

		const shareableLink = `${window.location.origin}/view/invoice/${invoiceId}`;

		navigator.clipboard
			.writeText(shareableLink)
			.then(() => {
				toast.success("Invoice link copied to clipboard");
			})
			.catch(() => {
				toast.error("Failed to copy invoice link");
				return thunkAPI.rejectWithValue("Failed to copy invoice link");
			});
	}
);

const invoiceSlice = createSlice({
	name: "invoice",
	initialState: defaultState,
	reducers: {
		resetInvoiceToView: (state) => {
			state.invoiceToView = null;
		},
	},
	extraReducers: (builder) => {
		// handleFetchInvoices
		builder.addCase(handleFetchInvoices.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleFetchInvoices.fulfilled, (state, action) => {
			return {
				...state,
				invoices: [...action.payload.invoices],
				isLoading: false,
				initialFetchAttempted: true,
			};
		});
		builder.addCase(handleFetchInvoices.rejected, (state, action) => {
			state.isLoading = false;
		});

		// handleCreateInvoice
		builder.addCase(handleCreateInvoice.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleCreateInvoice.fulfilled, (state, action) => {
			state.invoices.unshift(action.payload.createdInvoice);
			state.isLoading = false;
		});
		builder.addCase(handleCreateInvoice.rejected, (state, action) => {
			state.isLoading = false;
		});

		// handleEditInvoice
		builder.addCase(handleEditInvoice.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleEditInvoice.fulfilled, (state, action) => {
			const updatedInvoice = action.payload.updatedInvoice;
			const index = state.invoices.findIndex(
				(invoice) => invoice.id === updatedInvoice.id
			);

			if (index !== -1) {
				// Update the invoice at the same index
				state.invoices[index] = { ...state.invoices[index], ...updatedInvoice };
			}
			state.isLoading = false;
		});
		builder.addCase(handleEditInvoice.rejected, (state, action) => {
			state.isLoading = false;
		});

		// handleDeleteInvoice
		builder.addCase(handleDeleteInvoice.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleDeleteInvoice.fulfilled, (state, action) => {
			let updatedInvoices = [...state.invoices];

			updatedInvoices = updatedInvoices.filter(
				(invoice) => invoice.id !== action.payload.invoiceId
			);

			return { ...state, invoices: updatedInvoices, isLoading: false };
		});
		builder.addCase(handleDeleteInvoice.rejected, (state, action) => {
			state.isLoading = false;
		});

		// handleInvoiceMarkAsPaid
		builder.addCase(handleInvoiceMarkAsPaid.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(handleInvoiceMarkAsPaid.fulfilled, (state, action) => {
			const invoices = [...state.invoices];
			const updatedInvoices = invoices.map((invoice) => {
				if (invoice.id === action.payload.updatedInvoice.id) {
					return { ...action.payload.updatedInvoice };
				}
				return invoice;
			});
			return { ...state, invoices: updatedInvoices, isLoading: false };
		});
		builder.addCase(handleInvoiceMarkAsPaid.rejected, (state, action) => {
			state.isLoading = false;
		});

		// fetchInvoiceById
		builder.addCase(fetchInvoiceById.pending, (state, action) => {
			state.isLoading = true;
		});
		builder.addCase(fetchInvoiceById.fulfilled, (state, action) => {
			return {
				...state,
				invoiceToView: action.payload.invoice,
				isLoading: false,
			};
		});
		builder.addCase(fetchInvoiceById.rejected, (state, action) => {
			state.isLoading = false;
		});

		builder.addCase(RESET_STATE, (state) => {
			// Reset to initial state
			return defaultState;
		});
	},
});

export const { resetInvoiceToView } = invoiceSlice.actions;

export default invoiceSlice.reducer;
