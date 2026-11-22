"use client"

import { createBaseApi } from "./base-api"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api/v1" : "")

/**
 * Browser-safe API client for TanStack Query functions and interactive flows.
 * Only the explicitly public API origin may be exposed to the browser bundle.
 */
export const clientApi = createBaseApi(API_BASE_URL)
