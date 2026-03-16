import type { RequestHandler } from "express";
import successResponse from "../../lib/apiResponse/successResponse";

export const createMerchant: RequestHandler = async (req, res) => {
  console.log(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
  return successResponse(res, "dads", 201);
};
