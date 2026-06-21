// src/api/index.js

import { USE_MOCKS } from "../configs/env";
import * as mockApi from "../mocks/apiMock";

export const api = USE_MOCKS
  ? mockApi
  : realApi;