import { Router } from "express";
import { register, login, logout } from "./authentication.controllers";
import validationResponse from "../../middleware/validationResponse";
import {
  loginValidation,
  registerValidation,
} from "./authentication.validation";

const routes = Router();
routes.post("/register", registerValidation, validationResponse, register);
routes.post("/login", loginValidation, validationResponse, login);
routes.delete("/logout", logout);
export default routes;
