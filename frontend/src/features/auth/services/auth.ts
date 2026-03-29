import { LoginServiceType, RegisterServiceType } from "../types";
import api from "../../../shared/services/api";
export const registerService = async (body: RegisterServiceType) => {
  const response = await api("api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response.data;
};

export const loginService = async (body: LoginServiceType) => {
  const response = await api("api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return response.data;
};
