import { Router } from "express";
import { createApiKeys, revokeApiKey } from "./apiKeys.controllers";
const route = Router({mergeParams: true});

route.post("/", createApiKeys);
route.put("/revoke/:id", revokeApiKey)
export default route;
