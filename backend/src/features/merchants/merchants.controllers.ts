import type { RequestHandler } from "express";
import successResponse from "../../lib/apiResponse/successResponse";
import {
  createMerchantService,
  findMerchantService,
} from "./merchants.services";

export const createMerchant: RequestHandler = async (req, res) => {
  const { email, id } = res.locals.user;
  const { organizationName } = req.body;
  const { requestId } = res.locals;
  const merchant = await createMerchantService(
    id,
    email,
    organizationName,
    requestId,
  );
  return successResponse(res, merchant, 201);
};

export const findMerchant: RequestHandler = async (req, res) => {
  const { id } = res.locals.user;
  const merchant = await findMerchantService(id);
  return successResponse(res, merchant, 200);
};
