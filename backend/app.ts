import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import apiKeysV1 from "./src/features/apiKeys/apiKeys.routes";
import paymentsV1 from "./src/features/payments/payments.routes";
import merchantsV1 from "./src/features/merchants/merchants.routes";
import authenticationV1 from "./src/features/authentication/authentication.routes";
import globalErrorHandler from "./src/errors/globalErrorHandler";
import { AppError } from "./src/errors/appError";
import successResponse from "./src/lib/apiResponse/successResponse";
import { apiKeyAuth } from "./src/features/apiKeyAuth/apiKeyAuth.controllers";
import { requestMetadata } from "./src/middleware/requestMetadata";
import cookieParser from "cookie-parser";
import { verifySession } from "./src/middleware/verifySession";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(requestMetadata);

app.get("/", (req, res) => {
  return successResponse(res, { status: "ok", uptime: process.uptime() }, 200);
});

// health endpoint for monitoring
app.get("/health", (_, res) => {
  return successResponse(res, { status: "ok", uptime: process.uptime() }, 200);
});

const version1 = "/api/v1";

app.use(`${version1}/auth`, authenticationV1);

// protected routes (require logged-in user)
app.use(
  `${version1}/portal/merchants/:merchantId/api-keys`,
  verifySession,
  apiKeysV1,
);
app.use(`${version1}/portal/merchants`, verifySession, merchantsV1);

// public payments api (secured with api key instead of session)
app.use(`${version1}/payments`, apiKeyAuth, paymentsV1);

// global error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.path} not found`, 404, "ROUTE_NOT_FOUND"));
});

app.use(globalErrorHandler);

export default app;
