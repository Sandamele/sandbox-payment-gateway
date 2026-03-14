import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import apiKeysV1 from "./src/features/apiKeys/apiKeys.routes";
import globalErrorHandler from "./src/errors/globalErrorHandler";
import { AppError } from "./src/errors/appError";
import { requestMetadata } from "./src/middleware/requestMetadata";
import successResponse from "./src/lib/apiResponse/successResponse";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(requestMetadata);
app.get("/", (_, res) => {
  return successResponse(res, { message: "Welcome To SendPay" }, 200);
});

// this endpoint check the health of the server
app.get("/health", (_, res) => {
  return successResponse(res, { status: "ok", uptime: process.uptime() }, 200);
});

// v1 endpoints
const version1 = "/api/v1";
app.use(`${version1}/merchants/:merchantId/api-keys`, apiKeysV1);

// this handles endpoints that do not exist
app.use((req: Request, res: Response, next: NextFunction) => {
  return next(new AppError(`${req.path} not found`, 404, "ROUTE_NOT_FOUND"));
});

app.use(globalErrorHandler);

export default app;
