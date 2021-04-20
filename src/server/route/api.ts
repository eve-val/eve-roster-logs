import express = require("express");
import { requireAuth } from "../auth/requireAuth";
import { API_PATH } from "./api/path";
import { API_STAT } from "./api/stat";

export const API = express.Router();

API.use(requireAuth);

API.get("/path/*", API_PATH);
API.get("/stat/*", API_STAT);
