import type { RequestHandler } from "express";
import successResponse from "../../lib/apiResponse/successResponse";
import {
  createMerchantService,
  findMerchantService,
} from "./merchants.services";

export const createMerchant: RequestHandler = async (req, res) => {
  const { email, sub: userId } = req.oidc.user as {
    email: string;
    sub: string;
  };
  const { organizationName } = req.body;
  const merchant = await createMerchantService(userId, email, organizationName);
  return successResponse(res, merchant, 201);
};

export const findMerchant: RequestHandler = async (req, res) => {
  const { sub: userId } = req.oidc.user as { sub: string };
  const merchant = await findMerchantService(userId);
  return successResponse(res, merchant, 200);
};
