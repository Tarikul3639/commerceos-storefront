import "server-only"

import { createBaseApi } from "./base-api"

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/+$/, "")

/**
 * Server-only API client. API_URL is intentionally not exposed to browser code.
 * Production fails clearly when the server API origin has not been configured.
 */
function createServerApi() {
  if (!API_BASE_URL) {
    throw new Error("[API] Configure API_URL in the server environment.")
  }

  return createBaseApi(API_BASE_URL)
}

export const serverApi = createServerApi()
