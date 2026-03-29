import type { RequestHandler } from "express";
import successResponse from "../../lib/apiResponse/successResponse";
import { auth } from "../../lib/auth";
import { isAPIError } from "better-auth/api";
import errorResponse from "../../lib/apiResponse/errorResponse";
import { authenticationLogger } from "../../lib/logger";

export const currentLoginUser: RequestHandler = async (req, res) => {
  const { requestId } = res.locals;
  try {
    const session = await auth.api.getSession();
    const user = {
      id: session?.user.id,
      email: session?.user.email,
      role: session?.user.role,
    };
    return successResponse(res, user, 200);
  } catch (error) {
    if (isAPIError(error)) {
      authenticationLogger.error({ error, requestId }, "Logout Error");
      return errorResponse(res, error.body, error.statusCode);
    }
  }
};

export const register: RequestHandler = async (req, res) => {
  const { requestId } = res.locals;
  try {
    const { name, email, password, role } = req.body;

    const { headers, response } = await auth.api.signUpEmail({
      returnHeaders: true,
      body: {
        email,
        password,
        name: name,
        role,
      },
    });
    const sessionToken = headers.get("set-cookie");
    if (sessionToken) {
      res.setHeader("Set-Cookie", sessionToken);
    }
    return successResponse(res, response, 201);
  } catch (error) {
    if (isAPIError(error)) {
      authenticationLogger.error({ error, requestId }, "Registration Error");
      return errorResponse(res, error.body, error.statusCode);
    }
  }
};

export const login: RequestHandler = async (req, res) => {
  const { requestId } = res.locals;
  try {
    const { email, password } = req.body;
    const { headers, response } = await auth.api.signInEmail({
      returnHeaders: true,
      body: { email, password },
    });
    const sessionToken = headers.get("set-cookie");
    if (sessionToken) {
      res.setHeader("Set-Cookie", sessionToken);
    }
    return successResponse(res, response, 200);
  } catch (error) {
    if (isAPIError(error)) {
      authenticationLogger.error({ error, requestId }, "Login Error");
      return errorResponse(res, error.body, error.statusCode);
    }
  }
};

export const logout: RequestHandler = async (req, res) => {
  const { requestId } = res.locals;
  try {
    const { headers, response } = await auth.api.signOut({
      headers: req.headers,
      returnHeaders: true,
    });

    const cookies = headers.get("set-cookie");
    if (cookies) {
      res.setHeader("Set-Cookie", cookies);
    }

    return successResponse(res, response, 200);
  } catch (error) {
    if (isAPIError(error)) {
      authenticationLogger.error({ error, requestId }, "Logout Error");
      return errorResponse(res, error.body, error.statusCode);
    }
  }
};
