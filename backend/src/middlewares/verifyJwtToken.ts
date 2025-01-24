import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import HttpError from "@/models/HttpError.model";
import { RequestProps } from "@/utils/types";

interface DecodedToken extends JwtPayload {
	userId: string;
}

const verifyJwtToken = (
	req: RequestProps,
	res: Response,
	next: NextFunction
) => {
	let token;
	if (req.method === "OPTIONS") {
		return next();
	}
	// console.log(JSON.stringify(req.cookies));
	try {
		if (
			req.headers.authorization &&
			req.headers.authorization.split(" ")[0] === "Bearer"
		) {
			token = req.headers.authorization.split(" ")[1]; //Authorization: "Bearer TOKEN"
		}

		if (!token) throw new HttpError(`Authentication Failed`, 401);

		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as DecodedToken;

		if (!decodedToken) throw new HttpError(`Authentication Failed`, 401);

		req.userData = { userId: decodedToken.userId };

		next();
	} catch (error) {
		throw new HttpError(`Authentication Failed`, 401);
	}
};

export default verifyJwtToken;
