class HttpError extends Error {
	public errorCode: number;
	public isOperational: boolean;

	constructor(message: string, errorCode: number) {
		super(message);
		this.errorCode = errorCode;
		this.isOperational = true; // To differentiate between operational errors and programming errors
		Error.captureStackTrace(this, this.constructor);
	}
}

export default HttpError;
