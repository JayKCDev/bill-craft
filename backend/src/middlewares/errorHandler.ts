import { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
	errorCode?: number;
	isOperational?: boolean;
}

const errorHandler = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error("Error: ", err); // Log the error for debugging

	let { errorCode, message } = err;

	// Default to 500 if statusCode is not set
	if (!errorCode) errorCode = 500;

	// For unknown errors, return a generic message
	if (!err.isOperational) {
		message = "Something went wrong. Please try again later.";
	}

	res.status(errorCode).json({
		status: "error",
		errorCode,
		message,
	});
};

export default errorHandler;
