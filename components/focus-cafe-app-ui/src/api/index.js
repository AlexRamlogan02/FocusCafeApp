// src/api/index.js

import { USE_MOCKS } from "../configs/env";
import * as mockApi from "../mocks/apiMock";

const realApiFallback = {
  startSession: async () => {
    throw new Error(
      "realApi is not implemented. Run with VITE_USE_MOCKS=true for local mocks."
    )
  },
  saveSession: async () => {
    throw new Error(
      "realApi is not implemented. Run with VITE_USE_MOCKS=true for local mocks."
    )
  },
};

export const api = USE_MOCKS ? mockApi : realApiFallback;